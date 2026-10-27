import connectDB from "../../utils/mongoose.js";
import axios from "axios";
import { TotalBooking } from "~~/server/models/totalBooking";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import { PendingPayment } from "~~/server/models/PendingPayment";
import nodemailer from "nodemailer";
import { Ticket } from "~~/server/models/Ticket";
import { generateTicketCode } from "~~/server/utils/generateTicketCode";
import PDFDocument from "pdfkit";
import QRCode from "qrcode"; // npm install qrcode
import { Notification } from "../../models/Notification";
import { getOptionalAuth } from "../../utils/requireAuth.js";
import { parseBody } from "../../utils/parseBody.js";

async function sendBookingEmails({
  config,
  booking,
  eventData,
  userData,
  ticketCount,
  ticketSummary,
  expectedAmount,
  transactionId,
  ticketCodeList,
  attachments,
}) {
  const delivery = { attendee: false, admins: false };

  if (
    !config.smtpHost ||
    !config.smtpPort ||
    !config.emailUsername ||
    !config.emailPass
  ) {
    console.warn("SMTP is not fully configured; booking emails were not sent.");
    return delivery;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    auth: { user: config.emailUsername, pass: config.emailPass },
  });
  const from = `"Happitwin events" <${config.emailUsername}>`;
  const holderName =
    `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
    userData.email;

  if (booking.attendeeEmailSentAt) {
    delivery.attendee = true;
  } else {
    try {
      await transporter.sendMail({
        from,
        to: userData.email,
        subject: `Booking Confirmed – ${eventData.title}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto">
            <h2>Booking Confirmed!</h2>
            <p>Hi <strong>${holderName}</strong>,</p>
            <p>Your <strong>${ticketCount}</strong> ${ticketCount === 1 ? "ticket" : "tickets"} for <strong>${eventData.title}</strong> ${ticketCount === 1 ? "is" : "are"} confirmed.</p>
            <p><strong>Date:</strong> ${new Date(eventData.date).toDateString()}</p>
            <p><strong>Location:</strong> ${eventData.location}</p>
            <p><strong>Tickets:</strong> ${ticketSummary}</p>
            <p><strong>Amount paid:</strong> KES ${expectedAmount}</p>
            <p><strong>Payment reference:</strong> ${transactionId}</p>
            <p><strong>Ticket codes:</strong> <code>${ticketCodeList}</code></p>
            <p>Your ticket PDF${ticketCount === 1 ? " is" : "s are"} attached. Present ${ticketCount === 1 ? "it" : "them"} at the entrance.</p>
          </div>
        `,
        attachments,
      });
      const sentAt = new Date();
      await TotalBooking.updateOne(
        { _id: booking._id },
        { $set: { attendeeEmailSentAt: sentAt } },
      );
      booking.attendeeEmailSentAt = sentAt;
      delivery.attendee = true;
    } catch (emailError) {
      console.error("Failed to send booking confirmation to attendee:", {
        bookingId: booking._id,
        message: emailError.message,
      });
    }
  }

  if (booking.adminEmailSentAt) {
    delivery.admins = true;
  } else {
    try {
      const admins = await User.find({
        role: "admin",
        email: { $type: "string", $ne: "" },
      })
        .select("email")
        .lean();
      const adminEmails = admins.map((admin) => admin.email).filter(Boolean);

      if (!adminEmails.length) {
        console.error(
          "No admin email recipients are configured for booking notifications.",
          {
            bookingId: booking._id,
          },
        );
      } else {
        await transporter.sendMail({
          from,
          to: adminEmails,
          subject: `New Booking – ${eventData.title}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto">
              <h2>New Booking Alert</h2>
              <p><strong>Event:</strong> ${eventData.title}</p>
              <p><strong>User:</strong> ${holderName}</p>
              <p><strong>Email:</strong> ${userData.email}</p>
              <p><strong>Tickets:</strong> ${ticketSummary}</p>
              <p><strong>Amount:</strong> KES ${expectedAmount}</p>
              <p><strong>Payment reference:</strong> ${transactionId}</p>
              <p><strong>Ticket codes:</strong> <code>${ticketCodeList}</code></p>
            </div>
          `,
          attachments,
        });
        const sentAt = new Date();
        await TotalBooking.updateOne(
          { _id: booking._id },
          { $set: { adminEmailSentAt: sentAt } },
        );
        booking.adminEmailSentAt = sentAt;
        delivery.admins = true;
      }
    } catch (emailError) {
      console.error("Failed to send booking notification to admins:", {
        bookingId: booking._id,
        message: emailError.message,
      });
    }
  }

  return delivery;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authUser = await getOptionalAuth(event);

  // Replaces readBody(): proxies/intermediaries that strip or rewrite the
  // Content-Type header make readBody() return {} and every field looks missing.
  const body = await parseBody(event);

  const { reference } = body;

  /* ── BASIC VALIDATION ─────────────────────────────────────── */
  if (typeof reference !== "string" || !reference.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "A payment reference is required",
    });
  }

  await connectDB();

  /* ── RESOLVE SERVER-BOUND PENDING PAYMENT ─────────────────── */
  let pending = await PendingPayment.findOne({
    CheckoutRequestID: reference.trim(),
  });

  if (!pending) {
    throw createError({
      statusCode: 400,
      statusMessage: "No matching payment found for this account",
    });
  }

  // Logged-in callers must own the payment; guests prove ownership with the
  // email address the STK push was initiated for.
  const requesterEmail = String(
    authUser?.email || body.email || "",
  )
    .trim()
    .toLowerCase();
  const pendingEmail = String(pending.userEmail || "").toLowerCase();

  const ownsPending = authUser
    ? pending.userId
      ? String(pending.userId) === String(authUser.id || authUser._id)
      : pendingEmail === requesterEmail
    : !!requesterEmail && requesterEmail === pendingEmail;

  if (!ownsPending) {
    throw createError({
      statusCode: 400,
      statusMessage: "No matching payment found for this account",
    });
  }

  const pendingId = pending._id;

  if (pending.status === "pending" && pending.payheroReference) {
    const username = config.payheroUsername;
    const password = config.payheroPassword;

    if (username && password) {
      try {
        const authHeader = Buffer.from(`${username}:${password}`).toString(
          "base64",
        );
        const { data: transaction } = await axios.get(
          "https://backend.payhero.co.ke/api/v2/transaction-status",
          {
            params: { reference: pending.payheroReference },
            headers: { Authorization: `Basic ${authHeader}` },
            timeout: 10000,
          },
        );
        const providerStatus = String(transaction?.status || "").toUpperCase();

        if (providerStatus === "SUCCESS") {
          const receivedAmount = Number(
            transaction.amount ?? transaction.Amount ?? pending.amount,
          );
          const isAmountValid =
            Number.isFinite(receivedAmount) &&
            receivedAmount === Number(pending.amount);

          pending = await PendingPayment.findOneAndUpdate(
            { _id: pending._id, status: "pending" },
            {
              $set: {
                status: isAmountValid ? "confirmed" : "mismatch",
                resultCode: isAmountValid ? 0 : -1,
                resultDesc: isAmountValid
                  ? "Payment confirmed."
                  : "Payment amount does not match the expected amount.",
                callbackAmount: receivedAmount,
                transactionId:
                  transaction.provider_reference ||
                  transaction.third_party_reference ||
                  transaction.CheckoutRequestID ||
                  "",
                verifiedAt: new Date(),
              },
            },
            { new: true },
          );

          if (!pending) {
            pending = await PendingPayment.findOne({ _id: pendingId });
          }
        } else if (providerStatus === "FAILED") {
          const resultCode =
            transaction.result_code ??
            transaction.resultCode ??
            transaction.error_code ??
            transaction.errorCode ??
            (transaction.message?.includes("cancel") ? 1032 : undefined) ??
            -1;
          pending = await PendingPayment.findOneAndUpdate(
            { _id: pending._id, status: "pending" },
            {
              $set: {
                status: "failed",
                resultCode: resultCode,
                resultDesc:
                  transaction.message ||
                  transaction.result_description ||
                  transaction.error_message ||
                  "PayHero payment failed.",
                verifiedAt: new Date(),
              },
            },
            { new: true },
          );

          if (!pending) {
            pending = await PendingPayment.findOne({ _id: pendingId });
          }
        }
      } catch (statusError) {
        console.error("Transaction status lookup failed:", {
          reference: pending.CheckoutRequestID,
          status: statusError.response?.status || null,
          message:
            statusError.response?.data?.error_message ||
            statusError.message ||
            "Unknown PayHero status error.",
        });
      }
    }
  }

  if (!pending) {
    throw createError({
      statusCode: 404,
      statusMessage: "Payment record is no longer available.",
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
      message = "STK has been cancelled";
    } else if (insufficient) {
      message =
        "Payment not successful. You do not have enough M-Pesa balance to complete this payment. Top up and try again.";
    } else if (pending.resultCode === 1037) {
      message =
        "Payment failed due to an incorrect M-Pesa PIN. Please try again.";
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

  if (
    pending.status !== "claimed" &&
    (eventData.status === "cancelled" || eventData.status === "completed")
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "This event is no longer available for booking",
    });
  }

  /* ── RESOLVE THE TICKET HOLDER ────────────────────────────── */
  // Registered accounts keep their account link; guests book with the name
  // and email captured when the STK push was initiated.
  const holderEmail = pending.userEmail;
  const registeredUser = pending.userId
    ? await User.findById(pending.userId)
    : await User.findOne({ email: holderEmail });

  const userData = registeredUser || {
    firstName: pending.firstName || "",
    lastName: pending.lastName || "",
    email: holderEmail,
    _id: null,
  };

  /* ── TICKET LINES & PRICE FROM THE PENDING PAYMENT ─────────*/
  // Never derived from client-supplied ticketType/eventName — the amount was
  // fixed server-side when the STK push was initiated by this user.
  const expectedAmount = pending.amount;

  const eventTicketTypes = Array.isArray(eventData.customTickets)
    ? eventData.customTickets
    : [];

  const ticketLines = (
    Array.isArray(pending.tickets) && pending.tickets.length > 0
      ? pending.tickets
      : [
          {
            ticketType: pending.ticketType,
            quantity: pending.quantity,
            amount: pending.amount,
          },
        ]
  ).map((line) => {
    // pending.tickets may contain Mongoose subdocuments; spreading one does
    // not copy its schema fields, so read the values explicitly.
    const requestedType = String(line.ticketType || "").trim();
    const matchedType = eventTicketTypes.find(
      (ticket) =>
        String(ticket.name || ticket.ticketType || ticket.type || "")
          .trim()
          .toLowerCase() === requestedType.toLowerCase(),
    );

    return {
      ticketType: matchedType
        ? String(
            matchedType.name || matchedType.ticketType || matchedType.type,
          ).trim()
        : requestedType,
      quantity: Number(line.quantity) || 0,
      amount: Number(line.amount) || 0,
    };
  });

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

  // A confirmed payment must always produce at least one ticket; never save an
  // empty booking or email a confirmation without passes.
  if (ticketCount < 1) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "No tickets were found for this payment. Please contact support.",
      data: { final: true },
    });
  }

  /* ── VERIFY PAYHERO PAYMENT CALLBACK ───────────────────────── */

  // A queued or pending request is not a completed payment.
  // Only the PayHero callback can mark the payment as confirmed.
  if (!["confirmed", "claimed"].includes(pending.status)) {
  if (pending.status === "pending") {
    throw createError({
      statusCode: 409,
      statusMessage:
        "Payment is still being processed. Please wait and try again.",
      data: { final: true },
    });
  }

    if (pending.status === "failed") {
      throw createError({
        statusCode: 400,
        statusMessage:
          pending.resultDesc || "Payment was unsuccessful. Please try again.",
        data: { final: true },
      });
    }

    if (pending.status === "mismatch") {
      throw createError({
        statusCode: 400,
        statusMessage: "Payment amount mismatch. Please contact support.",
        data: { final: true },
      });
    }

    throw createError({
      statusCode: 400,
      statusMessage: "Payment has not been confirmed by PayHero.",
      data: { final: true },
    });
  }

  /* ── VALIDATE THE CONFIRMED AMOUNT ─────────────────────────── */

  const paidAmount = Number(pending.callbackAmount);

  if (
    !Number.isFinite(expectedAmount) ||
    !Number.isFinite(paidAmount) ||
    expectedAmount <= 0 ||
    paidAmount !== expectedAmount
  ) {
    await PendingPayment.updateOne(
      {
        _id: pending._id,
        status: "confirmed",
      },
      {
        $set: {
          status: "mismatch",
          resultDesc:
            "PayHero payment amount does not match the expected booking amount.",
        },
      },
    );

    throw createError({
      statusCode: 400,
      statusMessage: "Payment amount mismatch. Please contact support.",
      data: { final: true },
    });
  }

  /* ── TRANSACTION REFERENCE ─────────────────────────────────── */

  const transactionId =
    pending.mpesaReceiptNumber || pending.transactionId || reference.trim();

  /* ── PREVENT DUPLICATE BOOKINGS ───────────────────────────── */
  const existingBooking = await TotalBooking.findOne({ reference });
  if (existingBooking) {
    let savedTickets = await Ticket.find({
      bookingId: existingBooking._id,
    }).sort({ createdAt: 1 });

    // Repair bookings that were saved without their tickets (older versions
    // dropped the ticket line quantities, leaving quantity 0 and no passes).
    // The conditional update also makes the repair safe against concurrent
    // verification retries.
    if (savedTickets.length === 0 && ticketCount > 0) {
      const repairedBooking = await TotalBooking.findOneAndUpdate(
        { _id: existingBooking._id, quantity: { $lt: 1 } },
        {
          $set: {
            quantity: ticketCount,
            ticketType: ticketLines.map((line) => line.ticketType).join(", "),
          },
        },
        { new: true },
      );

      if (repairedBooking) {
        for (const line of ticketLines) {
          const lineCount = Math.floor(Number(line.quantity) || 0);
          if (lineCount < 1) continue;
          const unitAmount = Math.round(
            (Number(line.amount) || 0) / lineCount,
          );

          for (let i = 0; i < lineCount; i++) {
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

            await Ticket.create({
              ticketCode,
              eventName: eventData.title,
              eventId: eventData._id,
              userEmail: userData.email,
              userId: userData._id || null,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              bookingId: existingBooking._id,
              ticketType: line.ticketType,
              amount: unitAmount,
            });
          }
        }
      }

      savedTickets = await Ticket.find({
        bookingId: existingBooking._id,
      }).sort({ createdAt: 1 });

      if (savedTickets.length > 0) {
        existingBooking.quantity = ticketCount;
        existingBooking.ticketType = ticketLines
          .map((line) => line.ticketType)
          .join(", ");
      }
    }

    const emailTickets = [];

    for (const ticket of savedTickets) {
      const qrPayload = [
        `Name: ${`${userData.firstName || ""} ${userData.lastName || ""}`.trim()}`,
        `Event: ${eventData.title}`,
        `Ticket type: ${ticket.ticketType}`,
        `Ticket code: ${ticket.ticketCode}`,
      ].join("\n");
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
        ticketCode: ticket.ticketCode,
        ticketType: ticket.ticketType,
        amount: ticket.amount,
        reference: existingBooking.transactionId || transactionId,
        name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        email: userData.email,
        qrBuffer,
      });
      emailTickets.push({ ticketCode: ticket.ticketCode, pdfBuffer });
    }

    const attachments = emailTickets.map((ticket) => ({
      filename: `ticket-${ticket.ticketCode}.pdf`,
      content: ticket.pdfBuffer,
      contentType: "application/pdf",
    }));
    const emailDelivery = await sendBookingEmails({
      config,
      booking: existingBooking,
      eventData,
      userData,
      ticketCount,
      ticketSummary,
      expectedAmount: existingBooking.amount,
      transactionId: existingBooking.transactionId || transactionId,
      ticketCodeList: emailTickets
        .map((ticket) => ticket.ticketCode)
        .join(", "),
      attachments,
    });

    return {
      message: "Booking already confirmed",
      booking: existingBooking,
      emailDelivery,
      ticketPdfBase64: emailTickets[0]?.pdfBuffer.toString("base64"),
    };
  }

  if (pending.status === "claimed") {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment was claimed but its booking could not be found.",
      data: { final: true },
    });
  }

  /* ── CLAIM THIS CONFIRMED PAYMENT ONCE ────────────────────── */

  const claimed = await PendingPayment.findOneAndUpdate(
    {
      _id: pending._id,
      status: "confirmed",
    },
    {
      $set: {
        status: "claimed",
        claimedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  if (!claimed) {
    throw createError({
      statusCode: 409,
      statusMessage:
        "This payment has already been processed or is being processed.",
    });
  }

  /* ── DECREMENT TICKET QUANTITY ATOMICALLY ─────────────────── */
  const stockByType = new Map();

  for (const line of ticketLines) {
    const quantity = Math.floor(Number(line.quantity) || 0);
    const ticketType = String(line.ticketType || "").trim();

    if (!ticketType || quantity < 1) continue;

    const key = ticketType.toLowerCase();
    const existing = stockByType.get(key);

    if (existing) existing.quantity += quantity;
    else stockByType.set(key, { ticketType, quantity });
  }

  const perTypeStock = [...stockByType.values()].filter((line) =>
    eventTicketTypes.some(
      (ticket) =>
        String(ticket.name || ticket.ticketType || ticket.type || "")
          .trim()
          .toLowerCase() === line.ticketType.toLowerCase(),
    ),
  );

  const availabilityFilters = perTypeStock.map((line) => ({
    customTickets: {
      $elemMatch: {
        name: line.ticketType,
        $or: [
          { availableQuantity: { $gte: line.quantity } },
          { availableQuantity: null, quantity: { $gte: line.quantity } },
        ],
      },
    },
  }));

  const stockUpdate =
    perTypeStock.length > 0
      ? [
          {
            $set: {
              TicketQuantity: { $subtract: ["$TicketQuantity", ticketCount] },
              customTickets: {
                $cond: [
                  { $isArray: "$customTickets" },
                  {
                    $map: {
                      input: "$customTickets",
                      as: "ticket",
                      in: {
                        $mergeObjects: [
                          "$$ticket",
                          {
                            availableQuantity: {
                              $subtract: [
                                {
                                  $ifNull: [
                                    "$$ticket.availableQuantity",
                                    "$$ticket.quantity",
                                  ],
                                },
                                {
                                  $sum: {
                                    $map: {
                                      input: {
                                        $filter: {
                                          input: {
                                            $literal: perTypeStock,
                                          },
                                          as: "stock",
                                          cond: {
                                            $eq: [
                                              {
                                                $toLower: {
                                                  $ifNull: [
                                                    "$$ticket.name",
                                                    "",
                                                  ],
                                                },
                                              },
                                              {
                                                $toLower:
                                                  "$$stock.ticketType",
                                              },
                                            ],
                                          },
                                        },
                                      },
                                      as: "stock",
                                      in: "$$stock.quantity",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                  "$customTickets",
                ],
              },
            },
          },
        ]
      : { $inc: { TicketQuantity: -ticketCount } };

  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventData._id,
      TicketQuantity: { $gte: ticketCount },
      status: { $nin: ["cancelled", "completed"] },
      ...(availabilityFilters.length ? { $and: availabilityFilters } : {}),
    },
    stockUpdate,
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
    ticketType: ticketLines.map((line) => line.ticketType).join(", "),
    quantity: ticketCount,
    amount: expectedAmount,
    transactionId,
    mpesaReceiptNumber: pending.mpesaReceiptNumber,
    verifiedAt: pending.verifiedAt || new Date(),
    bookedAt: new Date(),
    createdBy: userData._id || null,
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
        userId: userData._id || null,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
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

    const notifications = [];

    // Guests have no account to notify; they get their confirmation by email.
    if (userData._id) {
      notifications.push({
        title: "Booking confirmed",
        message: `Your booking for "${eventData.title}" (${ticketSummary}) was confirmed successfully.`,
        recipientUser: userData._id,
        recipientRole: "user",
        event: eventData._id,
        meta: { type: "booking_confirmed", quantity: ticketCount },
        read: false,
      });
    }

    notifications.push({
      title: "New event booking",
      message: `${bookerName} booked ${ticketSummary} for "${eventData.title}".`,
      recipientRole: "admin",
      event: eventData._id,
      meta: {
        type: "booking_created",
        bookerId: userData._id || null,
        bookerName,
        tickets: ticketLines.map((line) => ({
          ticketType: line.ticketType,
          quantity: Math.floor(Number(line.quantity) || 0),
        })),
        quantity: ticketCount,
        amount: expectedAmount,
      },
      read: false,
    });

    await Notification.insertMany(notifications);
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
  const attachments = tickets.map((t) => ({
    filename: `ticket-${t.ticketCode}.pdf`,
    content: t.pdfBuffer,
    contentType: "application/pdf",
  }));

  const ticketCodeList = tickets.map((t) => t.ticketCode).join(", ");
  const emailDelivery = await sendBookingEmails({
    config,
    booking,
    eventData,
    userData,
    ticketCount,
    ticketSummary,
    expectedAmount,
    transactionId,
    ticketCodeList,
    attachments,
  });

  /* ── RESPONSE ─────────────────────────────────────────────── */
  return {
    message: "Booking verified and saved successfully",
    booking,
    ticketCount,
    ticketPdfBase64: tickets[0]?.pdfBuffer.toString("base64"),
    emailDelivery,
  };
});
