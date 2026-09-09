import { Notification } from "~~/server/models/Notification.js";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const filter =
    user.role === "user"
      ? {
          $or: [
            {
              recipientUser: user.id,
              "meta.type": {
                $in: ["event_cancelled", "booking_confirmed", "new_event"],
              },
            },
            { recipientRole: "user", "meta.type": "new_event" },
          ],
        }
      : { recipientRole: user.role };
  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .lean();
  return { notifications };
});
