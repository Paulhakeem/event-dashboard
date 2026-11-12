import { Notification } from "~~/server/models/Notification.js";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const method = event.node.req.method;
  await connectDB();
  const user = await requireAuth(event);

  const notification = await Notification.findById(id);
  if (!notification) {
    throw createError({ statusCode: 404, message: "Notification not found" });
  }

  const canAccess =
    user.role === "admin" ||
    String(notification.recipientUser || "") === String(user.id);
  if (!canAccess) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  if (method === "PATCH") {
    const body = await readBody(event);
    if (typeof body?.read !== "boolean") {
      throw createError({
        statusCode: 400,
        statusMessage: "A boolean read value is required",
      });
    }

    notification.read = body.read;
    await notification.save();
    return { success: true, notification };
  }

  if (method === "DELETE") {
    await Notification.deleteOne({
      _id: notification._id,
      ...(user.role === "admin" ? {} : { recipientUser: user.id }),
    });
    return { success: true, message: "Notification deleted successfully" };
  }

  throw createError({ statusCode: 405, statusMessage: "Method not allowed" });
});
