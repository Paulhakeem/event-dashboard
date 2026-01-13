import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import nodemailer from "nodemailer";
import { paystack } from "~~/server/utils/paystack";
import { Ticket } from "~~/server/models/Ticket";
import { generateTicketCode } from "~~/server/utils/generateTicketCode";
import { generateQrCode } from "~~/server/utils/generateQr";

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
    eventId: eventData._id,
    userId: userData._id,
    bookingId: booking._id,
    ticketType,
    amount: expectedAmount,
  });

  /* -------------------- GENERATE QR CODE -------------------- */
  const qrImageBuffer = await generateQrCode(ticketCode);

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

    <img src="cid:ticketqr" alt="QR Code" width="200"/>

    <p>Please present this QR code at the entrance.</p>

    <p>Thank you for booking with us 🙏</p>
    `,
    attachments: [
      {
        filename: "ticket-qr.png",
        content: qrImageBuffer,
        cid: "ticketqr", // same cid value as in the html img src
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
    });
  }

  /* -------------------- RESPONSE -------------------- */
  return {
    message: "Booking verified and saved successfully",
    booking,
  };
});
