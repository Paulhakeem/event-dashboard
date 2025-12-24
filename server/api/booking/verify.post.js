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
  await connectDB();

  // validate input
  if (!phone || !eventId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Phone, Event ID and User ID are required",
    });
  }

  //   find the event
  const eventData = await Event.findById(eventId);
  if (!eventData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event not found",
    });
  }

  //   user data
  const userData = await User.findById(userId);
  if (!userData) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }
  // verify payment with Paystack
  const paystackResponse = await paystackClient.transaction.verify(reference);
  if (!paystackResponse.status || paystackResponse.data.status !== "success") {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment verification failed",
    });
  }

  //  save booking
  const booking = {
    eventId: paystackResponse.data.metadata.eventId,
    userId: paystackResponse.data.metadata.userId,
    eventName: paystackResponse.data.metadata.eventName,
    phone: paystackResponse.data.metadata.phone,
    reference: paystackResponse.data.metadata.reference,
    status: paystackResponse.data.status,
    amount: paystackResponse.data.amount / 100,
    bookedAt: new Date(),
  };

  const newBooking = new TotalBooking(booking);
  await newBooking.save();

  // config email
  try {
    const transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.emailUsername,
        pass: config.emailPassword,
      },
    });
    // send email to user
   const mailOptions = {
      from: `"Event Dashboard" <${config.emailUsername}>`,
      to: userData.email,
      subject: `Booking Confirmed for ${eventData.title}🤗`,
      html: `
        <h2>Hello</h2>
        <p>You have successfully booked <strong>${eventData.title}</strong>!</p>
        <p><strong>Location:</strong> ${eventData.location}</p>
        <p><strong>Date:</strong> ${new Date(
          eventData.date
        ).toLocaleDateString()}</p>
        <br/>
        <p>Thank you for booking with us🙏!</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Error setting up email transporter:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to set up email service",
    });
  }

    return { message: "Booking verified and saved successfully", booking };
});
