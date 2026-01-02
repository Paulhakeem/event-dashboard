import connectDB from "~~/server/utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";
import nodemailer from "nodemailer";
import { User } from "~~/server/models/User.js";
import { Event } from "../../models/Events.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { eventId, userId, reference, ticketType } = body;
  const config = useRuntimeConfig();

  if (!reference || !ticketType) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment reference and TicketType are required",
    });
  }

  await connectDB();

  // find event
  const eventData = await Event.findById(eventId);
  if (!eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }

  // find user
  const userData = await User.findById(userId);
  if (!userData) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  // ticket type
  const priceMap = {
    regular: eventData.regular,
    vip: eventData.vip,
    vvip: eventData.vvip,
  };

  const amount = priceMap[ticketType];

  if (!amount) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid ticket selected",
    });
  }

  // verify with Paystack
  const paystackResponse = await paystackClient.transaction.verify(reference);

  if (!paystackResponse.status || paystackResponse.data.status !== "success") {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment verification failed",
    });
  }

  const paystackRef = paystackResponse.data.reference;

  // prevent duplicates
  const existingBooking = await TotalBooking.findOne({
    reference: paystackRef,
  });

  if (existingBooking) {
    return {
      message: "Booking already confirmed",
      booking: existingBooking,
    };
  }

  // save booking
  const booking = {
    eventId,
    userId,
    eventName: eventData.title,
    reference: paystackRef,
    status: paystackResponse.data.status,
    ticketType,
    amount,
    bookedAt: new Date(),
  };

  const newBooking = await TotalBooking.create(booking);

  // find admin user to CC
  const admin = await User.findOne({ role: "admin" }).select(
    "email firstName lastName"
  );

  // send email
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: false,
    auth: {
      user: config.emailUsername,
      pass: config.emailPass,
    },
  });

  await transporter.sendMail({
    from: `"LetsBook Events" <${config.emailUsername}>`,
    to: userData.email,
    subject: `Booking Confirmed for ${eventData.title} 🤗`,
    html: `
      <h2>Hello ${userData.firstName || ""} ${userData.lastName || ""}</h2>
      <p>You have successfully booked <strong>${eventData.title}</strong>!</p>
      <p><strong>Location:</strong> ${eventData.location}</p>
      <p><strong>Date:</strong> ${new Date(
        eventData.date
      ).toLocaleDateString()}</p>
      <p>Reference: <strong>${paystackRef}</strong></p>
      <br/>
      <p>Thank you for booking with us 🙏</p>
    `,
  });

  // notify admin
  if (admin) {
    await transporter.sendMail({
      from: `"LetsBook Events" <${config.emailUsername}>`,
      to: admin.email,
      subject: `New Booking for ${eventData.title} 📢`,
      html: `
        <h2>Hello ${admin.firstName || ""} ${admin.lastName || ""}</h2>
        <p>A new booking has been made for <strong>${
          eventData.title
        }</strong>.</p>
        <p><strong>Booker:</strong> ${userData.firstName || ""} ${
        userData.lastName || ""
      }</p> 
        <p><strong>Email:</strong> ${userData.email}</p>
         <p><strong>Date:</strong> ${new Date(
           eventData.date
         ).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${eventData.location}</p>
        <p><strong>Reference:</strong> ${paystackRef}</p>
        <br/>
        <p>Please check the dashboard for more details.</p>
      `,
    });
  }

  return {
    message: "Booking verified and saved successfully",
    booking: newBooking,
  };
});
