import connectDB from "~~/server/utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";
import nodemailer from "nodemailer";
import { User } from "~~/server/models/User.js";
import { paystackClient } from "~~/server/utils/paystack.js";

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
  const bookingRecord = await TotalBooking.findOne(eventId);
  if (!bookingRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: "Booking record not found",
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
    eventId: bookingRecord._id,
    userId: userData._id,
    eventName: paystackResponse.data.metadata.eventName,
    phone: paystackResponse.data.metadata.customer.phone,
    reference: paystackResponse.data.metadata.reference,
    status: paystackResponse.data.metadata.status,
    amount: paystackResponse.data.metadata.amount / 100, // convert to main currency unit
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
      subject: `Booking Confirmed for ${booking.eventName}🤗`,
      html: `<p>Dear ${userData.name},</p>
        <p>Your booking for the event <strong>${booking.eventName}</strong> has been confirmed.</p>
        <p>Booking Details:</p>
        <ul>
          <li>Event Name: ${booking.eventName}</li>
            <li>Date: ${new Date(booking.bookedAt).toLocaleDateString()}</li>
          <li>Phone: ${booking.phone}</li>
            <li>Amount Paid: Ksh${booking.amount}</li>
            <li>Reference: ${booking.reference}</li>
        </ul>
        
        <p>Thank you for booking with us!</p>
        <p>Best regards,<br/>LetsBook Team</p>`,
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
