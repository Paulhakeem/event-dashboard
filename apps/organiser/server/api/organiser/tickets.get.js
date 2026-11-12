import mongoose from "mongoose";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Event } from "~~/server/models/Events.js";
import { Ticket } from "~~/server/models/Ticket.js";
import { syncTicketStatuses } from "~~/server/utils/syncTicketStatuses.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);

  if (user.role !== "organiser") {
    throw createError({
      statusCode: 403,
      statusMessage: "Organiser access required",
    });
  }

  await syncTicketStatuses();

  const ownedEvents = await Event.find({ createdBy: user.id })
    .select("_id title date startDate endDate location status")
    .sort({ createdAt: -1 })
    .lean();
  const eventIds = ownedEvents.map((item) => item._id);
  const summaries = eventIds.length
    ? await Ticket.aggregate([
        { $match: { eventId: { $in: eventIds } } },
        {
          $group: {
            _id: "$eventId",
            totalTickets: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            activeTickets: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            inactiveTickets: {
              $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
            },
            usedTickets: { $sum: { $cond: ["$used", 1, 0] } },
          },
        },
      ])
    : [];
  const summaryByEvent = new Map(
    summaries.map((summary) => [String(summary._id), summary]),
  );
  const events = ownedEvents.map((item) => {
    const summary = summaryByEvent.get(String(item._id));
    return {
      eventId: String(item._id),
      eventName: item.title,
      eventDate: item.startDate || item.date,
      location: item.location,
      status: item.status,
      totalTickets: summary?.totalTickets || 0,
      totalAmount: summary?.totalAmount || 0,
      activeTickets: summary?.activeTickets || 0,
      inactiveTickets: summary?.inactiveTickets || 0,
      usedTickets: summary?.usedTickets || 0,
    };
  });

  const eventId = getQuery(event).eventId;
  if (eventId === undefined) {
    return { events, tickets: [] };
  }
  if (!mongoose.isValidObjectId(eventId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid event id" });
  }

  const selectedEvent = ownedEvents.find(
    (item) => String(item._id) === String(eventId),
  );
  if (!selectedEvent) {
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have access to tickets for this event.",
    });
  }

  const tickets = await Ticket.find({ eventId: selectedEvent._id })
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  return {
    events,
    tickets: tickets.map((ticket) => {
      const firstName = ticket.userId?.firstName || ticket.firstName || "";
      const lastName = ticket.userId?.lastName || ticket.lastName || "";
      return {
        ...ticket,
        holderName:
          `${firstName} ${lastName}`.trim() || ticket.userEmail || "—",
        holderEmail: ticket.userId?.email || ticket.userEmail || "",
      };
    }),
  };
});
