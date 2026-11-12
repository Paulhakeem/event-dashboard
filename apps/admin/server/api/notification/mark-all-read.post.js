import { Notification } from "~~/server/models/Notification.js";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const filter = { recipientRole: user.role, read: { $ne: true } };
  await Notification.updateMany(filter, { $set: { read: true } });
  return { success: true, message: "All notifications marked as read" };
});
