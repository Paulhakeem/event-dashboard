import { Event } from "~~/server/models/Events.js";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const user = await requireAuth(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  if (user.role !== "organiser") {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  try {
    const events = await Event.find({ createdBy: user.id })
      .sort({ createdAt: -1 })
      .lean(); // faster response
    return {
      success: true,
      total: events.length,
      events,
    };
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err.message,
    });
  }
});
