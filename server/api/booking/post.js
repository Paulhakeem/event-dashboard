import { Event } from "../../models/Events.js";
import { User } from "../../models/User.js";
import { TotalBooking } from "../../models/totalBooking.js";
import nodemailer from "nodemailer";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const config = useRuntimeConfig();

  const body = await readBody(event);
  const { phone, eventId, userId } = body; // get both

  // make sure both are provided
  if (!phone || !eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID, User ID and phone number are required",
    });
  }

  // find the event
  const eventData = await Event.findById(eventId);
  if (!eventData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event not found",
    });
  }

  // find the user
  const userData = await User.findById(userId);
  if (!userData) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  // create booking object
  const booking = {
    eventId: eventData._id,
    userId: userData._id,
    phone,
    bookedAt: new Date(),
  };

  // push booking into event

  // save booking to Booking collection
  const newBooking = new TotalBooking(booking);
  await newBooking.save();

  // --- Send confirmation email ---
  try {
    const transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.emailUsername,
        pass: config.emailPass,
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
        <p><strong>Price:</strong> $${eventData.price}</p>
        <br/>
        <p>Thank you for booking with us🙏!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send email",
      data: err.message,
    });
  }

  return { message: "Booking successful", booking };
});
