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

  // if the selected ticket type is not configured for this event, reject
  if (expectedAmount === undefined || expectedAmount === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or unavailable ticket type selected",
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
        // refreshed compact ticket: 210 x 300 points (~3" x 4.2")
        const doc = new PDFDocument({ size: [210, 300], margin: 12 });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));

        // Base
        doc.rect(0, 0, 210, 300).fill('#ffffff');

        // Left accent strip
        doc.save();
        doc.roundedRect(6, 10, 34, 280, 6).fill('#9c4e8b');
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10).text('LB', 14, 34, { width: 18, align: 'center' });
        doc.restore();

        // Header area
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(12).text(details.eventTitle, 52, 14, { width: 146 });
        doc.font('Helvetica').fontSize(8).fillColor('#6b7280').text(details.eventDate, 52, 32);
        doc.text(details.location, 52, 44);

        // Divider
        doc.moveTo(52, 64).lineTo(196, 64).strokeColor('#e6e6e6').stroke();

        // Ticket code block
        doc.roundedRect(52, 72, 118, 56, 6).fill('#f8fafc');
        doc.fillColor('#111827').font('Courier-Bold').fontSize(16).text(details.ticketCode, 52, 90, { width: 118, align: 'center' });

        // Ticket type badge
        doc.roundedRect(52, 132, 62, 20, 6).fill('#eef2ff');
        doc.fillColor('#4f46e5').font('Helvetica-Bold').fontSize(9).text(details.ticketType.toUpperCase(), 52, 136, { width: 62, align: 'center' });

        // Purchaser info
        doc.fillColor('#111827').font('Helvetica').fontSize(9).text('Name', 52, 160);
        doc.font('Helvetica-Bold').text(details.name || '-', 100, 160, { width: 96 });

        doc.font('Helvetica').fontSize(9).text('Email', 52, 176);
        doc.font('Helvetica-Bold').fontSize(8).text(details.email || '-', 100, 176, { width: 96 });

        // Right perforated stub
        doc.moveTo(170, 10).lineTo(170, 290).dash(2, { space: 3 }).strokeColor('#e5e7eb').stroke();
        if (typeof doc.undash === 'function') doc.undash();

        doc.font('Helvetica').fontSize(8).fillColor('#374151').text('AMOUNT', 174, 26, { width: 32, align: 'center' });
        doc.font('Helvetica-Bold').fontSize(10).text(`KES ${details.amount}`, 174, 40, { width: 32, align: 'center' });

        doc.font('Helvetica').fontSize(7).fillColor('#6b7280').text('REF', 174, 66, { width: 32, align: 'center' });
        doc.font('Helvetica').fontSize(7).text(details.reference, 172, 76, { width: 36, align: 'center' });

        // Footer small note
        doc.font('Helvetica').fontSize(7).fillColor('#6b7280').text('Present this ticket at the entrance.', 52, 220, { width: 110, align: 'center' });

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
    from: `"B.M.E Events" <${config.emailUsername}>`,
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
      from: `"B.M.E Events" <${config.emailUsername}>`,
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
    ticketPdfBase64: pdfBuffer.toString("base64"),
  };
});
