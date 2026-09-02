import jwt from "jsonwebtoken";
import connectDB from "~~/server/utils/mongoose";
import { Event } from "~~/server/models/Events";
import { TotalBooking } from "~~/server/models/totalBooking";
import { Notification } from "~~/server/models/Notification";

const requireAdmin = (event) => {
  const header = getHeader(event, "authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  try {
    const user = jwt.verify(token, useRuntimeConfig().secretStr);
    if (user.role !== "admin") throw new Error();
    return user;
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }
};

export default defineEventHandler(async (event) => {
  const admin = requireAdmin(event);
  await connectDB();

  if (event.node.req.method === "GET") {
    const [events, bookings] = await Promise.all([
      Event.find()
        .populate("createdBy", "firstName lastName email")
        .sort({ date: 1 }),
      TotalBooking.aggregate([
        { $match: { status: { $in: ["success", "confirmed"] } } },
        {
          $group: {
            _id: "$eventName",
            bookings: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
      ]),
    ]);
    const metrics = Object.fromEntries(
      bookings.map((item) => [item._id, item]),
    );
    return {
      events: events.map((item) => ({
        ...item.toObject(),
        organiser: item.createdBy,
        bookings: metrics[item.title]?.bookings || 0,
        revenue: metrics[item.title]?.revenue || 0,
      })),
    };
  }

  const body = await readBody(event);
  if (!body?.id)
    throw createError({
      statusCode: 400,
      statusMessage: "Event id is required",
    });
  const current = await Event.findById(body.id);
  if (!current)
    throw createError({ statusCode: 404, statusMessage: "Event not found" });

  if (event.node.req.method === "DELETE") {
    await Event.deleteOne({ _id: current._id });
    return { success: true };
  }

  if (event.node.req.method !== "PATCH") {
    throw createError({ statusCode: 405, statusMessage: "Method not allowed" });
  }

  const action = body.action;
  const update = body.update || {};
  if (action === "approve") update.status = "upcoming";
  if (action === "reject") update.status = "cancelled";
  if (!["approve", "reject", "status", "update"].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unsupported event action",
    });
  }
  if (
    action === "status" &&
    ![
      "upcoming",
      "ongoing",
      "live",
      "completed",
      "cancelled",
      "pending",
      "inactive",
      "archived",
    ].includes(update.status)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid event status",
    });
  }

  const allowed = [
    "image",
    "title",
    "description",
    "date",
    "location",
    "TicketQuantity",
    "customTickets",
    "status",
    "eventType",
    "freeEntry",
  ];
  const changes = Object.fromEntries(
    Object.entries(update).filter(([key]) => allowed.includes(key)),
  );
  const updatedEvent = await Event.findByIdAndUpdate(current._id, changes, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "firstName lastName email");

  if (action === "approve" || action === "reject") {
    await Notification.create({
      title: action === "approve" ? "Event Approved" : "Event Rejected",
      message: `Your event "${current.title}" was ${action}d by an administrator.`,
      recipientRole: "organiser",
      recipientUser: current.createdBy,
      event: current._id,
      read: false,
    });
  }
  return { success: true, updatedEvent, performedBy: admin.id };
});
