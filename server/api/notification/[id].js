import { Notification } from "~~/server/models/Notification.js";
import connectDB from "~~/server/utils/mongoose.js";
import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  await connectDB();
    const user = await requireAuth(event);

    // check if user is authenticated
    if (!user) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    // only allow sender or recipient to delete
    const notification = await Notification.findById(id);
    if (!notification) {
      throw createError({ statusCode: 404, message: "Notification not found" });
    }
    await Notification.findByIdAndDelete(id);
    return { success: true, message: "Notification deleted successfully" };
})