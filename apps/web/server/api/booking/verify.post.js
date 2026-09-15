import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import { PendingPayment } from "~~/server/models/PendingPayment";
import nodemailer from "nodemailer";
import axios from "axios";
import { Ticket } from "~~/server/models/Ticket";
import { generateTicketCode } from "~~/server/utils/generateTicketCode";
import PDFDocument from "pdfkit";
import QRCode from "qrcode"; // npm install qrcode
import { Notification } from "../../models/Notification";
import { requireAuth } from "../../utils/requireAuth.js";
import { parseBody } from "../../utils/parseBody.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authUser = await requireAuth(event);

  // Replaces readBody(): proxies/intermediaries that strip or rewrite the
  // Content-Type header make readBody() return {} and every field looks missing.
  const body = await parseBody(event);

  const { reference } = body;
  const userEmail = authUser.email;

  /* ── BASIC VALIDATION ─────────────────────────────────────── */
  if (typeof reference !== "string" || !reference.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "A payment reference is required",
    });
  }

  await connectDB();

  /* ── RESOLVE SERVER-BOUND PENDING PAYMENT ─────────────────── */
  const pending = await PendingPayment.findOne({
    CheckoutRequestID: reference.trim(),
    userId: authUser.id,
  });
  if (!pending) {
    throw createError({
      statusCode: 400,
      statusMessage: "No matching payment found for this account",
    });
  }

  if (pending.status === "claimed") {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment already processed",
      data: { final: true },
    });
  }

  if (pending.status === "failed") {
    const desc = (pending.resultDesc || "").toLowerCase();
    const cancelled = pending.resultCode === 1032;
    const insufficient =
      pending.resultCode === 1 ||
      desc.includes("insufficient") ||
      desc.includes("balance");

    let message = "Payment not successful. Please try again.";
    if (cancelled) {
      message = "Payment was cancelled. Please try again.";
    } else if (insufficient) {
      message =
        "Payment not successful. You do not have enough M-Pesa balance to complete this payment. Top up and try again.";
    } else if (pending.resultCode === 1037) {
      message = "Payment failed due to an incorrect M-Pesa PIN. Please try again.";
    }

    throw createError({
      statusCode: 400,
      statusMessage: message,
      data: { final: true },
    });
  }

  if (pending.status === "mismatch") {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment amount mismatch",
      data: { final: true },
    });
  }

  /* ── FIND EVENT ───────────────────────────────────────────── */
  const eventData = await Event.findById(pending.eventId);
  if (!eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }

  if (eventData.status === "cancelled" || eventData.status === "completed") {
    throw createError({
      statusCode: 400,
      statusMessage: "This event is no longer available for booking",
    });
  }

  /* ── FIND USER ────────────────────────────────────────────── */
  const userData = await User.findOne({ email: userEmail });
  if (!userData) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  /* ── TICKET LINES & PRICE FROM THE PENDING PAYMENT ─────────*/
  // Never derived from client-supplied ticketType/eventName — the amount was
  // fixed server-side when the STK push was initiated by this user.
  const expectedAmount = pending.amount;

  const ticketLines =
    Array.isArray(pending.tickets) && pending.tickets.length > 0
      ? pending.tickets
      : [
          {
            ticketType: pending.ticketType,
            quantity: pending.quantity,
            amount: pending.amount,
          },
        ];

  const ticketCount = ticketLines.reduce(
    (sum, line) => sum + Math.floor(Number(line.quantity) || 0),
    0,
  );

  const ticketSummary = ticketLines
    .map(
      (line) =>
        `${Math.floor(Number(line.quantity) || 0)} × ${line.ticketType}`,
    )
    .join(", ");

  /* ── VERIFY DARAJA M-PESA ─────────────────────────────────── */
  const consumerKey = config.darajaConsumerKey;
  const consumerSecret = config.darajaConsumerSecret;
  const darajaUrl = config.darajaUrl || "https://sandbox.safaricom.co.ke";
  const passkey = config.darajaPasskey;

  if (!consumerKey || !consumerSecret || !passkey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Daraja API credentials not configured",
    });
  }

  let accessToken;
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64",
    );
    const tokenRes = await axios.get(
      `${darajaUrl}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    accessToken = tokenRes.data.access_token;
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to get Daraja access token",
    });
  }

  let darajaData;
  try {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${config.mpesaShortCode}${passkey}${timestamp}`,
    ).toString("base64");

    const checkRes = await axios.post(
      `${darajaUrl}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: config.mpesaShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: reference,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (checkRes.data.ResultCode !== 0 && checkRes.data.ResultCode !== "0") {
      const queryResultCode = Number(checkRes.data.ResultCode);
      const knownErrors = {
        1: {
          statusMessage:
            "Payment not successful. You do not have enough M-Pesa balance to complete this payment.",
          final: true,
        },
        1032: {
          statusMessage: "Payment was cancelled. Please try again.",
          final: true,
        },
        1037: {
          statusMessage:
            "Payment failed due to an incorrect M-Pesa PIN. Please try again.",
          final: true,
        },
      };
      const mapped = knownErrors[queryResultCode];

      throw createError({
        statusCode: 400,
        statusMessage:
          mapped?.statusMessage || "M-Pesa STK push verification failed",
        data: mapped?.final ? { final: true } : undefined,
      });
    }
    darajaData = checkRes.data;
  } catch (err) {
    if (err?.statusCode) throw err;

    throw createError({
      statusCode: 400,
      statusMessage:
        err.response?.data?.errorMessage ||
        "Payment not successful. Please try again.",
    });
  }

  /* ── AMOUNT VALIDATION ────────────────────────────────────── */
  // Prefer the amount relayed by the M-Pesa callback (verified against the
  // expected amount when it was received). Otherwise, if the query response
  // includes an amount, validate it. If neither is available, fall back to the
  // amount bound server-side when this user initiated the STK push — it was
  // fixed at initiation time and cannot be changed by a client-supplied
  // event/ticket.
  let paidAmount;
  if (pending.status === "confirmed" && Number.isFinite(pending.callbackAmount)) {
    paidAmount = pending.callbackAmount;
  } else {
    const amountParam = darajaData.ResultParameters?.ResultParameter?.find(
      (p) => p.Key === "Amount",
    )?.Value;
    const parsedAmount = amountParam !== undefined ? parseInt(amountParam, 10) : NaN;
    paidAmount = Number.isNaN(parsedAmount) ? expectedAmount : parsedAmount;
  }

  if (paidAmount !== expectedAmount) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment amount mismatch",
    });
  }

  const transactionId =
    darajaData.ResultParameters?.ResultParameter?.find(
      (p) => p.Key === "MpesaReceiptNumber",
    )?.Value || reference;

  /* ── PREVENT DUPLICATE BOOKINGS ───────────────────────────── */
  const existingBooking = await TotalBooking.findOne({ reference });
  if (existingBooking) {
    return { message: "Booking already confirmed", booking: existingBooking };
  }

  /* ── CLAIM THIS PAYMENT ONCE (atomic, race-safe) ──────────── */
  const claimed = await PendingPayment.findOneAndUpdate(
    { _id: pending._id, status: { $in: ["pending", "confirmed"] } },
    { $set: { status: "claimed", claimedAt: new Date() } },
    { new: true },
  );
  if (!claimed) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment already processed",
    });
  }

  /* ── DECREMENT TICKET QUANTITY ATOMICALLY ─────────────────── */
  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventData._id,
      TicketQuantity: { $gte: ticketCount },
      status: { $nin: ["cancelled", "completed"] },
    },
    { $inc: { TicketQuantity: -ticketCount } },
    { new: true },
  );
  if (!updatedEvent) {
    throw createError({ statusCode: 400, statusMessage: "Tickets sold out" });
  }

  /* ── SAVE BOOKING ─────────────────────────────────────────── */
  const booking = await TotalBooking.create({
    eventName: eventData.title,
    userEmail: userData.email,
    reference,
    status: "success",
    ticketType: ticketLines
      .map((line) => line.ticketType)
      .join(", "),
    quantity: ticketCount,
    amount: expectedAmount,
    bookedAt: new Date(),
    createdBy: userData._id,
    organiserId: eventData.createdBy,
  });

  /* ── GENERATE TICKETS (one per person, per ticket line) ─── */
  const tickets = [];

  for (const line of ticketLines) {
    const lineCount = Math.floor(Number(line.quantity) || 0);
    const unitAmount = Math.round((Number(line.amount) || 0) / lineCount);

    for (let i = 0; i < lineCount; i++) {
      /* ── Generate unique ticket code ─────────────────────────── */
      let ticketCode;
      let created = false;

      for (let retries = 3; retries > 0; retries--) {
        ticketCode = generateTicketCode();
        const exists = await Ticket.findOne({ ticketCode });
        if (!exists) {
          created = true;
          break;
        }
      }

      if (!created) {
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to generate unique ticket code",
        });
      }

      const ticket = await Ticket.create({
        ticketCode,
        eventName: eventData.title,
        eventId: eventData._id,
        userEmail: userData.email,
        userId: userData._id,
        bookingId: booking._id,
        ticketType: line.ticketType,
        amount: unitAmount,
      });

      /* ── Generate this ticket's QR + PDF ─────────────────────── */
      const qrPayload = [
        `Name: ${`${userData.firstName || ""} ${userData.lastName || ""}`.trim()}`,
        `Event: ${eventData.title}`,
        `Ticket type: ${line.ticketType}`,
        `Ticket code: ${ticketCode}`,
      ].join("\n");

      // Pure black on white = maximum contrast = easiest to scan
      const qrBuffer = await QRCode.toBuffer(qrPayload, {
        type: "png",
        width: 200,
        margin: 2,
        errorCorrectionLevel: "L",
        color: { dark: "#000000", light: "#ffffff" },
      });

      const pdfBuffer = await generateTicketPdf({
        eventTitle: eventData.title,
        eventDate: new Date(eventData.date).toDateString(),
        location: eventData.location,
        ticketCode,
        ticketType: line.ticketType,
        amount: unitAmount,
        reference: transactionId,
        name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        email: userData.email,
        qrBuffer,
      });

      tickets.push({ ticketCode, pdfBuffer });
    }
  }

  try {
    const bookerName =
      `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
      userData.email;

    await Notification.insertMany([
      {
        title: "Booking confirmed",
        message: `Your booking for "${eventData.title}" (${ticketSummary}) was confirmed successfully.`,
        recipientUser: userData._id,
        event: eventData._id,
        meta: { type: "booking_confirmed", quantity: ticketCount },
        read: false,
      },
      {
        title: "New event booking",
        message: `${bookerName} booked ${ticketSummary} for "${eventData.title}".`,
        recipientRole: "admin",
        event: eventData._id,
        meta: {
          type: "booking_created",
          bookerId: userData._id,
          bookerName,
          tickets: ticketLines.map((line) => ({
            ticketType: line.ticketType,
            quantity: Math.floor(Number(line.quantity) || 0),
          })),
          quantity: ticketCount,
          amount: expectedAmount,
        },
        read: false,
      },
    ]);
  } catch (notificationError) {
    console.error("Failed to create booking notification:", notificationError);
  }

  async function generateTicketPdf(details) {
    return new Promise((resolve, reject) => {
      try {
        // Business-card ticket: 3.5 × 2 inches (252 × 144 pt)
        const doc = new PDFDocument({ size: [252, 144], margin: 0 });
        const chunks = [];
        doc.on("data", (c) => chunks.push(c));
        doc.on("end", () => resolve(Buffer.concat(chunks)));

        // ── Background ──────────────────────────────────────────
        doc.rect(0, 0, 252, 144).fill("#ffffff");

        // ── Top colour band ──────────────────────────────────────
        doc.rect(0, 0, 252, 32).fill("#9c4e8b");

        // Event title in band
        doc
          .fillColor("#ffffff")
          .font("Helvetica-Bold")
          .fontSize(8)
          .text(details.eventTitle, 8, 7, { width: 236, align: "left" });

        // Date + location in band
        doc
          .font("Helvetica")
          .fontSize(6)
          .fillColor("#f3e8f9")
          .text(`${details.eventDate}  ·  ${details.location}`, 8, 20, {
            width: 236,
            align: "left",
          });

        // ── Tear-off dashed line ─────────────────────────────────
        doc
          .moveTo(0, 32)
          .lineTo(252, 32)
          .dash(3, { space: 4 })
          .strokeColor("#d8b4fe")
          .lineWidth(0.5)
          .stroke();
        if (typeof doc.undash === "function") doc.undash();

        // ── Left body: holder info ───────────────────────────────
        const LX = 8;
        let LY = 40;

        const row = (label, value) => {
          doc
            .font("Helvetica")
            .fontSize(5)
            .fillColor("#6b7280")
            .text(label, LX, LY);
          doc
            .font("Helvetica-Bold")
            .fontSize(6)
            .fillColor("#111827")
            .text(value, LX, LY + 7, { width: 150 });
          LY += 16;
        };

        row("TICKET HOLDER", details.name || "—");
        row("TICKET TYPE", details.ticketType.toUpperCase());
        row("AMOUNT PAID", `KES ${details.amount}`);
        row("REFERENCE", details.reference);

        // ── Ticket code ──────────────────────────────────────────
        doc.roundedRect(LX, LY, 150, 16, 3).fill("#f1f5f9");
        doc
          .font("Courier-Bold")
          .fontSize(8)
          .fillColor("#9c4e8b")
          .text(details.ticketCode, LX, LY + 6, {
            width: 150,
            align: "center",
          });
        LY += 20;

        // ── QR code (right side) ─────────────────────────────────
        doc.image(details.qrBuffer, 174, 40, { width: 68, height: 68 });

        // "SCAN TO VERIFY" label under QR
        doc
          .font("Helvetica")
          .fontSize(5)
          .fillColor("#6b7280")
          .text("SCAN TO VERIFY", 174, 111, { width: 68, align: "center" });

        // ── Vertical divider between body columns ────────────────
        doc
          .moveTo(168, 36)
          .lineTo(168, 128)
          .dash(2, { space: 3 })
          .strokeColor("#e5e7eb")
          .lineWidth(0.5)
          .stroke();
        if (typeof doc.undash === "function") doc.undash();

        // ── Footer ───────────────────────────────────────────────
        doc.rect(0, 128, 252, 16).fill("#f8fafc");
        doc
          .font("Helvetica")
          .fontSize(5)
          .fillColor("#9ca3af")
          .text(
            "Present this ticket at the entrance · Not transferable · Volora Events",
            0,
            133,
            { width: 252, align: "center" },
          );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /* ── BUILD ATTACHMENTS FROM GENERATED TICKETS ─────────────── */
  const attachments = tickets.map((t, i) => ({
    filename: `ticket-${t.ticketCode}.pdf`,
    content: t.pdfBuffer,
    contentType: "application/pdf",
  }));

  const ticketCodeList = tickets.map((t) => t.ticketCode).join(", ");

  /* ── SEND EMAILS ──────────────────────────────────────────── */
  if (
    config.smtpHost &&
    config.smtpPort &&
    config.emailUsername &&
    config.emailPass
  ) {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort),
      secure: Number(config.smtpPort) === 465,
      auth: { user: config.emailUsername, pass: config.emailPass },
    });

    const holderName =
      `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

    // Email to user
    try {
      await transporter.sendMail({
        from: `"Volora Events" <${config.emailUsername}>`,
        to: userData.email,
        subject: `Booking Confirmed – ${eventData.title} 🎉`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto">
            <div style="background:#9c4e8b;padding:24px;border-radius:12px 12px 0 0">
              <h2 style="color:#fff;margin:0">Booking Confirmed! 🎉</h2>
            </div>
            <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
              <p>Hi <strong>${holderName}</strong>,</p>
              <p>Your <strong>${ticketCount}</strong> ${ticketCount === 1 ? "ticket" : "tickets"} for <strong>${eventData.title}</strong> ${ticketCount === 1 ? "is" : "are"} confirmed.</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
                <tr><td style="padding:8px 0;color:#6b7280">Event</td><td style="padding:8px 0"><strong>${eventData.title}</strong></td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Date</td><td style="padding:8px 0">${new Date(eventData.date).toDateString()}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Location</td><td style="padding:8px 0">${eventData.location}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Tickets</td><td style="padding:8px 0">${ticketSummary}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Amount Paid</td><td style="padding:8px 0">KES ${expectedAmount}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Reference</td><td style="padding:8px 0"><code>${transactionId}</code></td></tr>
              </table>
              <div style="background:#f8fafc;border-radius:8px;padding:16px;text-align:center;margin:16px 0">
                <p style="margin:0 0 6px;color:#6b7280;font-size:12px">YOUR TICKET ${ticketCount === 1 ? "CODE" : "CODES"}</p>
                <p style="font-family:monospace;font-size:16px;font-weight:bold;color:#9c4e8b;margin:0;word-break:break-word">${ticketCodeList}</p>
              </div>
              <p style="font-size:13px;color:#6b7280">Your ticket PDF${ticketCount === 1 ? "" : "s"} ${ticketCount === 1 ? "is" : "are"} attached. Present ${ticketCount === 1 ? "it" : "them"} (printed or on your phone) at the entrance.</p>
              <p>Thank you for booking with Volora Events 🙏</p>
            </div>
          </div>
        `,
        attachments,
      });
    } catch (err) {
      console.error("Error sending email to user:", err);
    }

    // Email to admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      try {
        await transporter.sendMail({
          from: `"Volora Events" <${config.emailUsername}>`,
          to: admin.email,
          subject: `New Booking – ${eventData.title}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto">
              <h2>New Booking Alert 📢</h2>
              <p><strong>Event:</strong> ${eventData.title}</p>
              <p><strong>User:</strong> ${holderName}</p>
              <p><strong>Email:</strong> ${userData.email}</p>
              <p><strong>Tickets:</strong> ${ticketSummary}</p>
              <p><strong>Amount:</strong> KES ${expectedAmount}</p>
              <p><strong>Reference:</strong> ${transactionId}</p>
              <p><strong>Ticket Codes:</strong> <code>${ticketCodeList}</code></p>
            </div>
          `,
          attachments,
        });
      } catch (err) {
        console.error("Error sending email to admin:", err);
      }
    }
  } else {
    console.warn("SMTP not configured; skipping booking notification emails.");
  }

  /* ── RESPONSE ─────────────────────────────────────────────── */
  return {
    message: "Booking verified and saved successfully",
    booking,
    ticketCount,
    ticketPdfBase64: tickets[0]?.pdfBuffer.toString("base64"),
  };
});
