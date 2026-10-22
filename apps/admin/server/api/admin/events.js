import jwt from "jsonwebtoken";
import connectDB from "~~/server/utils/mongoose";
import { Event } from "~~/server/models/Events";
import { TotalBooking } from "~~/server/models/totalBooking";
import { Notification } from "~~/server/models/Notification";
import { Ticket } from "~~/server/models/Ticket";
import { PendingPayment } from "~~/server/models/PendingPayment";

const requireAdmin = (event) => {
  const header = getHeader(event, "authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  try {
    const user = jwt.verify(token, useRuntimeConfig().secretStr, {
      algorithms: ["HS256"],
    });
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
            ticketsSold: { $sum: { $ifNull: ["$quantity", 1] } },
            revenue: { $sum: "$amount" },
          },
        },
      ]),
    ]);
    const metrics = Object.fromEntries(
      bookings.map((item) => [item._id, item]),
    );
    return {
      events: events.map((item) => {
        const obj = item.toObject();
        const sold = metrics[item.title]?.ticketsSold || 0;
        return {
          ...obj,
          organiser: item.createdBy,
          bookings: metrics[item.title]?.bookings || 0,
          ticketsSold: sold,
          ticketsRemaining: Math.max(0, (item.TicketQuantity || 0) - sold),
          revenue: metrics[item.title]?.revenue || 0,
        };
      }),
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
    await Promise.all([
      Event.deleteOne({ _id: current._id }),
      TotalBooking.deleteMany({ eventName: current.title }),
      Ticket.deleteMany({
        $or: [{ eventId: current._id }, { eventName: current.title }],
      }),

      PendingPayment.deleteMany({
        $or: [{ eventId: current._id }, { eventName: current.title }],
      }),
    ]);
    return { success: true };
  }

  if (event.node.req.method !== "PATCH") {
    throw createError({ statusCode: 405, statusMessage: "Method not allowed" });
  }

  const action = body.action;
  const update = body.update || {};
  const isApproved = action === "approve";
  const isCancelled =
    action === "status" &&
    update.status === "cancelled" &&
    current.status !== "cancelled";
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
    "startDate",
    "endDate",
    "startTime",
    "endTime",
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

  // Normalize ticket edits so availableQuantity is never reset to 0 and
  // TicketQuantity stays in sync with the per-type quantities.
  if (Array.isArray(changes.customTickets)) {
    const prevTickets = Array.isArray(current.customTickets)
      ? current.customTickets
      : [];
    changes.customTickets = changes.customTickets
      .filter((t) => t && t.name)
      .map((t) => {
        const name = String(t.name).trim();
        const quantity = Math.max(0, Number(t.quantity) || 0);
        const prev = prevTickets.find(
          (p) =>
            String(p.name || "").trim().toLowerCase() === name.toLowerCase(),
        );
        const prevQty = Math.max(0, Number(prev?.quantity) || 0);
        const prevAvail = Math.max(
          0,
          Number(prev?.availableQuantity ?? prevQty) || 0,
        );
        const delta = quantity - prevQty;
        const availableQuantity = Math.max(
          0,
          Math.min(quantity, prevAvail + delta),
        );
        return {
          name,
          price: Number(t.price) || 0,
          quantity,
          availableQuantity,
        };
      });
    const effectiveFreeEntry =
      "freeEntry" in changes ? Boolean(changes.freeEntry) : Boolean(current.freeEntry);
    if (!effectiveFreeEntry) {
      changes.TicketQuantity = changes.customTickets.reduce(
        (sum, t) => sum + (Number(t.quantity) || 0),
        0,
      );
    }
  }

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

  if (isApproved) {
    await Notification.create({
      title: "New event available",
      message: `A new event, "${updatedEvent.title}", is now available to browse and book.`,
      recipientRole: "user",
      event: current._id,
      meta: { type: "new_event" },
      read: false,
    });
  }

  if (isCancelled) {
    const ticketHolders = await Ticket.find({ eventId: current._id }).distinct(
      "userId",
    );
    if (ticketHolders.length) {
      await Notification.insertMany(
        ticketHolders.map((recipientUser) => ({
          title: "Event cancelled",
          message: `The event "${updatedEvent.title}" has been cancelled.`,
          recipientUser,
          event: current._id,
          meta: { type: "event_cancelled" },
          read: false,
        })),
      );
    }
  }
  return { success: true, updatedEvent, performedBy: admin.id };
});
