import { Event } from "../../models/Events.js";
import { User } from "../../models/User.js";

import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event);
  const { eventId, userId, number } = body;

  //   check if userid, eventid and number are provided
  if (!eventId || !userId || !number) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID, User ID and phone number",
    });
  }

  // find the event by id
  const eventData = await Event.findById(eventId);
  if (!eventData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event not found",
    });
  }
  // find the user by id
  const userData = await User.findById(userId);
  if (!userData) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  // save booking info to DB
  const booking = {
    event: eventData._id,
    user: userData._id,
    number,
    bookedAt: new Date(),
  };
  eventData.bookings.push(booking);
  await eventData.save();

  return { message: "Booking successful", booking };
});
