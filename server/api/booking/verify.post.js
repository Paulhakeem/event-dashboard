import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import nodemailer from "nodemailer";
import axios from "axios";
import { Ticket } from "~~/server/models/Ticket";
import { generateTicketCode } from "~~/server/utils/generateTicketCode";
import PDFDocument from "pdfkit";
import QRCode from "qrcode"; // npm install qrcode

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { reference, ticketType, eventName, userEmail } = body;

  /* ── BASIC VALIDATION ─────────────────────────────────────── */
  if (!eventName || !userEmail || !reference || !ticketType) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "eventName, userEmail, reference and ticketType are required",
    });
  }

  await connectDB();

  /* ── FIND EVENT ───────────────────────────────────────────── */
  const eventData = await Event.findOne({ title: eventName });
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

  /* ── TICKET PRICE LOOKUP ──────────────────────────────────── */
  const matchedTicket = eventData.customTickets?.find(
    (t) => t.name === ticketType,
  );
  if (
    !matchedTicket ||
    matchedTicket.price === undefined ||
    matchedTicket.price === null
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or unavailable ticket type selected",
    });
  }
  const expectedAmount = matchedTicket.price;

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
      throw createError({
        statusCode: 400,
        statusMessage: "M-Pesa STK push verification failed",
      });
    }
    darajaData = checkRes.data;
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage:
        err.response?.data?.errorMessage || "Payment verification failed",
    });
  }

  /* ── AMOUNT VALIDATION ────────────────────────────────────── */
  const paidAmount =
    parseInt(
      darajaData.ResultParameters?.ResultParameter?.find(
        (p) => p.Key === "Amount",
      )?.Value,
    ) || expectedAmount;

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

  /* ── DECREMENT TICKET QUANTITY ATOMICALLY ─────────────────── */
  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventData._id,
      TicketQuantity: { $gt: 0 },
      status: { $nin: ["cancelled", "completed"] },
    },
    { $inc: { TicketQuantity: -1 } },
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
    ticketType,
    amount: expectedAmount,
    bookedAt: new Date(),
    createdBy: userData._id,
    organiserId: eventData.createdBy,
  });

  /* ── GENERATE UNIQUE TICKET CODE ──────────────────────────── */
  let ticketCode;
  let retries = 3;
  while (retries > 0) {
    ticketCode = generateTicketCode();
    const exists = await Ticket.findOne({ ticketCode });
    if (!exists) break;
    retries--;
  }
  if (retries === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate unique ticket code",
    });
  }

  await Ticket.create({
    ticketCode,
    eventName: eventData.title,
    eventId: eventData._id,
    userEmail: userData.email,
    userId: userData._id,
    bookingId: booking._id,
    ticketType,
    amount: expectedAmount,
  });

  /* ── GENERATE TICKET PDF ──────────────────────────────────── */
  // QR code payload — contains all verifiable details
  // Scan this at the entrance to verify authenticity
  const qrPayload = JSON.stringify({
    code: ticketCode,
    event: eventData.title,
    type: ticketType,
    email: userData.email,
    ref: transactionId,
    amount: expectedAmount,
    issued: new Date().toISOString(),
  });

  // Generate QR code as PNG buffer
  const qrBuffer = await QRCode.toBuffer(qrPayload, {
    type: "png",
    width: 90, // small — fits neatly on ticket
    margin: 1,
    errorCorrectionLevel: "H", // high correction — more secure
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  async function generateTicketPdf(details) {
    return new Promise((resolve, reject) => {
      try {
        // Compact ticket: 250 × 320 pt (~3.5" × 4.5")
        const doc = new PDFDocument({ size: [250, 320], margin: 0 });
        const chunks = [];
        doc.on("data", (c) => chunks.push(c));
        doc.on("end", () => resolve(Buffer.concat(chunks)));

        // ── Background ──────────────────────────────────────────
        doc.rect(0, 0, 250, 320).fill("#ffffff");

        // ── Top colour band ──────────────────────────────────────
        doc.rect(0, 0, 250, 56).fill("#9c4e8b");

        // Event title in band
        doc
          .fillColor("#ffffff")
          .font("Helvetica-Bold")
          .fontSize(11)
          .text(details.eventTitle, 16, 12, { width: 218, align: "left" });

        // Date + location in band
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#f3e8f9")
          .text(`${details.eventDate}  ·  ${details.location}`, 16, 32, {
            width: 218,
            align: "left",
          });

        // ── Tear-off dashed line ─────────────────────────────────
        doc
          .moveTo(0, 56)
          .lineTo(250, 56)
          .dash(3, { space: 4 })
          .strokeColor("#d8b4fe")
          .lineWidth(0.5)
          .stroke();
        if (typeof doc.undash === "function") doc.undash();

        // ── Left body: holder info ───────────────────────────────
        const LX = 16;
        let LY = 68;

        const row = (label, value) => {
          doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor("#6b7280")
            .text(label, LX, LY);
          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor("#111827")
            .text(value, LX, LY + 10, { width: 138 });
          LY += 28;
        };

        row("TICKET HOLDER", details.name || "—");
        row("EMAIL", details.email);
        row("TICKET TYPE", details.ticketType.toUpperCase());
        row("AMOUNT PAID", `KES ${details.amount}`);
        row("REFERENCE", details.reference);

        // ── Ticket code ──────────────────────────────────────────
        doc.roundedRect(LX, LY, 140, 26, 4).fill("#f1f5f9");
        doc
          .font("Courier-Bold")
          .fontSize(13)
          .fillColor("#9c4e8b")
          .text(details.ticketCode, LX, LY + 6, {
            width: 140,
            align: "center",
          });
        LY += 34;

        // ── QR code (right side) ─────────────────────────────────
        // QR sits in the right column, vertically centred in body
        doc.image(details.qrBuffer, 162, 66, { width: 72, height: 72 });

        // "SCAN TO VERIFY" label under QR
        doc
          .font("Helvetica")
          .fontSize(6)
          .fillColor("#9ca3af")
          .text("SCAN TO VERIFY", 162, 142, { width: 72, align: "center" });

        // ── Vertical divider between body columns ────────────────
        doc
          .moveTo(154, 60)
          .lineTo(154, 300)
          .dash(2, { space: 3 })
          .strokeColor("#e5e7eb")
          .lineWidth(0.5)
          .stroke();
        if (typeof doc.undash === "function") doc.undash();

        // ── Footer ───────────────────────────────────────────────
        doc.rect(0, 296, 250, 24).fill("#f8fafc");
        doc
          .font("Helvetica")
          .fontSize(6.5)
          .fillColor("#9ca3af")
          .text(
            "Present this ticket at the entrance · Not transferable · Volora Events",
            0,
            304,
            { width: 250, align: "center" },
          );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  const pdfBuffer = await generateTicketPdf({
    eventTitle: eventData.title,
    eventDate: new Date(eventData.date).toDateString(),
    location: eventData.location,
    ticketCode,
    ticketType,
    amount: expectedAmount,
    reference: transactionId,
    name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
    email: userData.email,
    qrBuffer, // pass QR image buffer directly to pdfkit
  });

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
              <p>Your ticket for <strong>${eventData.title}</strong> is confirmed.</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
                <tr><td style="padding:8px 0;color:#6b7280">Event</td><td style="padding:8px 0"><strong>${eventData.title}</strong></td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Date</td><td style="padding:8px 0">${new Date(eventData.date).toDateString()}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Location</td><td style="padding:8px 0">${eventData.location}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Ticket Type</td><td style="padding:8px 0">${ticketType.toUpperCase()}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Amount Paid</td><td style="padding:8px 0">KES ${expectedAmount}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">Reference</td><td style="padding:8px 0"><code>${transactionId}</code></td></tr>
              </table>
              <div style="background:#f8fafc;border-radius:8px;padding:16px;text-align:center;margin:16px 0">
                <p style="margin:0 0 6px;color:#6b7280;font-size:12px">YOUR TICKET CODE</p>
                <p style="font-family:monospace;font-size:22px;font-weight:bold;color:#9c4e8b;margin:0">${ticketCode}</p>
              </div>
              <p style="font-size:13px;color:#6b7280">Your ticket PDF is attached. Present it (printed or on your phone) at the entrance.</p>
              <p>Thank you for booking with Volora Events 🙏</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `ticket-${ticketCode}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
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
              <p><strong>Ticket:</strong> ${ticketType.toUpperCase()}</p>
              <p><strong>Amount:</strong> KES ${expectedAmount}</p>
              <p><strong>Reference:</strong> ${transactionId}</p>
              <p><strong>Ticket Code:</strong> <code>${ticketCode}</code></p>
            </div>
          `,
          attachments: [
            {
              filename: `ticket-${ticketCode}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
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
    ticketPdfBase64: pdfBuffer.toString("base64"),
  };
});
