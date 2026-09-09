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
      statusMessage: "Only users can view saved events",
    });
  }
  const user = await User.findById(authUser.id).select("favoriteEvents").lean();
  const favorites = await Event.find({
    _id: { $in: user?.favoriteEvents || [] },
  })
    .sort({ date: 1 })
    .lean();
  return { success: true, favorites };
});
