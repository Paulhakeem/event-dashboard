import { Notification } from "~~/server/models/Notification.js";
import connectDB from "~~/server/utils/mongoose.js";
import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);
  // check if user is authenticated and is admin
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const notifications = await Notification.find({ recipient: user._id }).sort({
    createdAt: -1,
  });
  const notificationsWithSender = await Promise.all(
    notifications.map(async (notification) => {
      const sender = await User.findById(notification.sender);
      return {
        ...notification.toObject(),
        sender: sender ? {
          name: sender.firstName + " " + sender.lastName,
          email: sender.email,
        } : null,
      };
    }),
  );
  return { notifications: notificationsWithSender };
});
