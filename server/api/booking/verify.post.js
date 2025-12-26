import connectDB from "~~/server/utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";
import nodemailer from "nodemailer";
import { User } from "~~/server/models/User.js";
import { paystackClient } from "~~/server/utils/paystack.js";
import { Event } from "../../models/Events.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { phone, eventId, userId, reference } = body;
  const config = useRuntimeConfig();

  if (!reference) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment reference is required",
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
    phone,
    reference: paystackRef,
    status: paystackResponse.data.status,
    amount: paystackResponse.data.amount / 100,
    bookedAt: new Date(),
  };

  const newBooking = await TotalBooking.create(booking);

  // send email
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailUsername,
      pass: config.emailPass,
    },
  });

  await transporter.sendMail({
    from: `"Event Dashboard" <${config.emailUsername}>`,
    to: userData.email,
    subject: `Booking Confirmed for ${eventData.title} 🤗`,
    html: `
      <h2>Hello ${userData.name || ""}</h2>
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

  return {
    message: "Booking verified and saved successfully",
    booking: newBooking,
  };
});
