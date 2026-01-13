import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import nodemailer from "nodemailer";
import { paystack } from "~~/server/utils/paystack";
import { Ticket } from "~~/server/models/Ticket";
import { generateTicketCode } from "~~/server/utils/generateTicketCode";
import PDFDocument from "pdfkit";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { reference, ticketType, eventName, userEmail } = body;

  /* -------------------- BASIC VALIDATION -------------------- */
  if (!eventName || !userEmail || !reference || !ticketType) {
    throw createError({
      statusCode: 400,
      statusMessage: "eventName, userEmail, reference and ticketType are required",
    });
  }

  await connectDB();

  /* -------------------- FIND EVENT -------------------- */
  const eventData = await Event.findOne({ title: eventName });
  if (!eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }

  /* -------------------- FIND USER -------------------- */
  const userData = await User.findOne({ email: userEmail });
  if (!userData) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  /* -------------------- TICKET PRICE MAP -------------------- */
  const priceMap = {
    regular: eventData.regular,
    vip: eventData.vip,
    vvip: eventData.vvip,
  };

  const expectedAmount = priceMap[ticketType];

  if (!expectedAmount) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid ticket type selected",
    });
  }

  /* -------------------- VERIFY PAYSTACK -------------------- */
  const paystackResponse = await paystack.transaction.verify(reference);

  if (!paystackResponse.status || paystackResponse.data.status !== "success") {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment verification failed",
    });
  }

  const paystackData = paystackResponse.data;

  /* -------------------- AMOUNT VALIDATION -------------------- */
  const paidAmount = paystackData.amount / 100;

  if (paidAmount !== expectedAmount) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment amount mismatch",
    });
  }

  /* -------------------- METADATA VALIDATION -------------------- */
  if (
    paystackData.metadata?.eventName !== String(eventName) ||
    paystackData.metadata?.userEmail !== String(userEmail) ||
    paystackData.metadata?.ticketType !== ticketType
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment metadata mismatch",
    });
  }

  /* -------------------- PREVENT DUPLICATE BOOKINGS -------------------- */
  const existingBooking = await TotalBooking.findOne({
    reference: paystackData.reference,
  });

  if (existingBooking) {
    return {
      message: "Booking already confirmed",
      booking: existingBooking,
    };
  }

  /* -------------------- DECREMENT TICKET QUANTITY ATOMICALLY -------------------- */
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventData._id, TicketQuantity: { $gt: 0 } },
    { $inc: { TicketQuantity: -1 } },
    { new: true }
  );

  if (!updatedEvent) {
    throw createError({ statusCode: 400, statusMessage: "Tickets sold out" });
  }

  /* -------------------- SAVE BOOKING -------------------- */
  const booking = await TotalBooking.create({
    eventName: eventData.title,
    userEmail: userData.email,
    reference: paystackData.reference,
    status: paystackData.status,
    ticketType,
    amount: expectedAmount,
    bookedAt: new Date(),
  });

  // -------------------- GENERATE TICKET -------------------- */
  const ticketCode = generateTicketCode();

  await Ticket.create({
    ticketCode,
    eventName: eventData.title,
    userEmail: userData.email,
    bookingId: booking._id,
    ticketType,
    amount: expectedAmount,
  });

  /* -------------------- CREATE TICKET PDF -------------------- */
  function generateTicketPdfBuffer(details) {
    return new Promise((resolve, reject) => {
      try {
        // very small ticket: 220 x 350 points (~3" x 4.8")
        const doc = new PDFDocument({ size: [220, 350], margin: 12 });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));

        // white background
        doc.rect(0, 0, 220, 350).fill("#ffffff");

        // Header bar
        doc.save();
        doc.rect(0, 0, 220, 48).fill("#0b5fff");
        doc.fillColor("#ffffff").fontSize(12).font("Helvetica-Bold").text("LetsBook", 12, 12);
        doc.fontSize(8).font("Helvetica").text("Event Ticket", 12, 26);
        doc.restore();

        // Event title (centered)
        doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text(details.eventTitle, 12, 58, {
          width: 196,
          align: "center",
        });

        // Small event meta
        doc.fontSize(8).font("Helvetica").fillColor("#374151").text(`${details.eventDate} • ${details.location}`, 12, 78, {
          width: 196,
          align: "center",
        });

        // Decorative divider
        doc.moveTo(12, 95).lineTo(208, 95);
        doc.dash(3, { space: 2 });
        doc.strokeColor('#e5e7eb').stroke();
        if (typeof doc.undash === 'function') doc.undash();

        // Ticket code box
        doc.strokeColor('#111827');
        doc.roundedRect(18, 104, 184, 56, 6).stroke();
        doc.font("Courier-Bold").fontSize(14).fillColor("#111827").text(details.ticketCode, 18, 122, {
          width: 184,
          align: "center",
        });

        // Barcode-like small text
        doc.font("Courier").fontSize(7).fillColor("#374151").text(details.ticketCode.split("").join(" "), 12, 166, {
          width: 196,
          align: "center",
        });

        // Info grid
        doc.font("Helvetica").fontSize(8).fillColor("#111827");
        const leftX = 14;
        const rightX = 110;
        const yStart = 186;
        doc.text("Type", leftX, yStart);
        doc.text(details.ticketType.toUpperCase(), rightX, yStart);

        doc.text("Amount", leftX, yStart + 12);
        doc.text(`KES ${details.amount}`, rightX, yStart + 12);

        doc.text("Ref", leftX, yStart + 24);
        doc.text(details.reference, rightX, yStart + 24, { width: 96 });

        // Purchaser info
        doc.text("Name", leftX, yStart + 36);
        doc.text(details.name || '-', rightX, yStart + 36, { width: 96 });

        doc.text("Email", leftX, yStart + 48);
        doc.text(details.email || '-', rightX, yStart + 48, { width: 96 });

        // Tear dashed line
        doc.moveTo(12, 236).lineTo(208, 236);
        doc.dash(2, { space: 3 });
        doc.strokeColor('#9ca3af').stroke();
        if (typeof doc.undash === 'function') doc.undash();

        // Footer notes
        doc.fontSize(7).fillColor("#6b7280").text("Present this ticket at the entrance.", 12, 244, { width: 196, align: "center" });
        doc.fontSize(7).text("Thank you for booking with LetsBook Events.", 12, 258, { width: 196, align: "center" });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  const pdfBuffer = await generateTicketPdfBuffer({
    eventTitle: eventData.title,
    eventDate: new Date(eventData.date).toDateString(),
    location: eventData.location,
    ticketCode,
    ticketType,
    amount: expectedAmount,
    reference: paystackData.reference,
    name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
    email: userData.email,
  });

  /* -------------------- EMAIL SETUP -------------------- */
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    auth: {
      user: config.emailUsername,
      pass: config.emailPass,
    },
  });

  /* -------------------- EMAIL USER -------------------- */
  await transporter.sendMail({
    from: `"LetsBook Events" <${config.emailUsername}>`,
    to: userData.email,
    subject: `Booking Confirmed – ${eventData.title} 🎉`,
    html: `
      <h2>Hello ${userData.firstName || ""} ${userData.lastName || ""}</h2>
      <p>Your booking was successful!</p>

      <p><strong>Event:</strong> ${eventData.title}</p>
      <p><strong>Ticket Type:</strong> ${ticketType.toUpperCase()}</p>
      <p><strong>Amount Paid:</strong> KES ${expectedAmount}</p>
      <p><strong>Date:</strong> ${new Date(eventData.date).toDateString()}</p>
      <p><strong>Location:</strong> ${eventData.location}</p>
      <p><strong>Reference:</strong> ${paystackData.reference}</p>

      <br/>
       <h3>🎟️ Ticket Code</h3>
    <p style="font-size:18px"><strong>${ticketCode}</strong></p>

    <p>Your ticket PDF is attached to this email. Please download and present it at the entrance.</p>

    <p>Thank you for booking with us 🙏</p>
    `,
    attachments: [
      {
        filename: "ticket.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  /* -------------------- EMAIL ADMIN -------------------- */
  const admin = await User.findOne({ role: "admin" });

  if (admin) {
    await transporter.sendMail({
      from: `"LetsBook Events" <${config.emailUsername}>`,
      to: admin.email,
      subject: `New Booking – ${eventData.title}`,
      html: `
        <h2>New Booking Alert 📢</h2>
        <p><strong>Event:</strong> ${eventData.title}</p>
        <p><strong>User:</strong> ${userData.firstName || ""} ${
        userData.lastName || ""
      }</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Ticket:</strong> ${ticketType.toUpperCase()}</p>
        <p><strong>Amount:</strong> KES ${expectedAmount}</p>
        <p><strong>Reference:</strong> ${paystackData.reference}</p>
      `,
      attachments: [
        {
          filename: "ticket.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  }

  /* -------------------- RESPONSE -------------------- */
  return {
    message: "Booking verified and saved successfully",
    booking,
  };
});
