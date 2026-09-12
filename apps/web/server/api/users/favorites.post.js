import mongoose from "mongoose";
import connectDB from "~~/server/utils/mongoose.js";
import { Event } from "~~/server/models/Events.js";
import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const authUser = requireAuth(event);
  if (authUser.role !== "user") {
    throw createError({
      statusCode: 403,
      statusMessage: "Only users can save events",
    });
  }
  const { eventId } = await readBody(event);

  if (!mongoose.isValidObjectId(eventId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid event is required",
    });
  }
  if (!(await Event.exists({ _id: eventId }))) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }

  const user = await User.findById(authUser.id).select("favoriteEvents");
  const saved = !user.favoriteEvents.some(
    (id) => String(id) === String(eventId),
  );
  user.favoriteEvents = saved
    ? [...user.favoriteEvents, eventId]
    : user.favoriteEvents.filter((id) => String(id) !== String(eventId));
  await user.save();

  const favorites = await Event.find({ _id: { $in: user.favoriteEvents } })
    .sort({ date: 1 })
    .lean();
  return { success: true, saved, favorites };
});
