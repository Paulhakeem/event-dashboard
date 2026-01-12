import connectDB from "~~/server/utils/mongoose";
import { TotalBooking } from "~~/server/models/totalBooking";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import nodemailer from "nodemailer";
import { paystack } from "~~/server/utils/paystack";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { eventId, userId, reference, ticketType } = body;

  /* -------------------- BASIC VALIDATION -------------------- */
  if (!eventId || !userId || !reference || !ticketType) {
    throw createError({
      statusCode: 400,
      statusMessage: "eventId, userId, reference and ticketType are required",
    });
  }

  await connectDB();

  /* -------------------- FIND EVENT -------------------- */
  const eventData = await Event.findById(eventId);
  if (!eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }

  /* -------------------- FIND USER -------------------- */
  const userData = await User.findById(userId);
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
    paystackData.metadata?.eventId !== String(eventId) ||
    paystackData.metadata?.userId !== String(userId) ||
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

  /* -------------------- SAVE BOOKING -------------------- */
  const booking = await TotalBooking.create({
    eventId,
    userId,
    eventName: eventData.title,
    reference: paystackData.reference,
    status: paystackData.status,
    ticketType,
    amount: expectedAmount,
    bookedAt: new Date(),
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
      <p>Thank you for booking with us 🙏</p>
    `,
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
