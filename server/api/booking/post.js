import { Event } from "../../models/Events.js";
import {  TotalBooking } from "../../models/totalBooking.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event);
  const { phone, eventId } = body; // get both

  // make sure both are provided
  if (!phone || !eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID and phone number are required",
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

  // create booking object
  const booking = {
    eventId: eventData._id,
    phone,
    bookedAt: new Date(),
  };

  // push booking into event

  // save booking to Booking collection
  const newBooking = new TotalBooking(booking);
  await newBooking.save();

  return { message: "Booking successful", booking };
});
