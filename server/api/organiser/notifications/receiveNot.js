import { Notification } from "~~/server/models/Notification.js";
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
  // Organisers should only see notifications addressed to their account.
  const notifications = await Notification.find({
    recipientUser: user.id,
  }).sort({
    createdAt: -1,
  });
  return { notifications };
});
