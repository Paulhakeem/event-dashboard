import mongoose from "mongoose";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Event, getEventStartEnd } from "~~/server/models/Events.js";
import { Ticket } from "~~/server/models/Ticket.js";
import { syncTicketStatuses } from "~~/server/utils/syncTicketStatuses.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);

  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }

  await syncTicketStatuses();
  const { eventId } = getQuery(event);
  if (eventId !== undefined) {
    if (!mongoose.isValidObjectId(eventId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid event id",
      });
    }

    const [eventDetails, tickets] = await Promise.all([
      Event.findById(eventId)
        .select("title date startDate endDate startTime endTime location")
        .lean(),
      Ticket.find({ eventId })
        .populate("userId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return {
      event: eventDetails,
      eventExpired: Boolean(
        (() => {
          const window = getEventStartEnd(eventDetails || {});
          return window && window.end < new Date();
        })(),
      ),
      tickets: tickets.map((ticket) => {
        const base = ticket.toObject ? ticket.toObject() : ticket;
        const user = base.userId || {};
        const firstName = user.firstName || base.firstName || "";
        const lastName = user.lastName || base.lastName || "";
        const holderName = `${firstName} ${lastName}`.trim() || base.holderName || "";
        const holderEmail = user.email || base.userEmail || base.email || base.holderEmail || "";
        return {
          _id: base._id,
          ticketCode: base.ticketCode,
          ticketType: base.ticketType,
          amount: base.amount,
          quantity: base.quantity,
          status: base.status,
          used: base.used,
          usedAt: base.usedAt,
          eventName: base.eventName || eventDetails?.title || "",
          eventId: base.eventId,
          userId: base.userId,
          holderName,
          holderEmail,
        };
      }),
    };
  }

  const groupedTickets = await Ticket.aggregate([
    {
      $group: {
        _id: "$eventId",
        eventName: { $first: "$eventName" },
        totalTickets: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        activeTickets: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },

        inactiveTickets: {
          $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
        },
        usedTickets: {
          $sum: { $cond: ["$used", 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        eventId: "$_id",
        eventName: 1,
        totalTickets: 1,
        totalAmount: 1,
        activeTickets: 1,

        inactiveTickets: 1,
        usedTickets: 1,
      },
    },
    { $sort: { totalTickets: -1, eventName: 1 } },
  ]);

  const eventIds = groupedTickets.map((item) => item.eventId);
  const eventDetails = await Event.find({ _id: { $in: eventIds } })
    .select("title date location")
    .lean();
  const eventsById = new Map(
    eventDetails.map((item) => [String(item._id), item]),
  );

  return {
    events: groupedTickets.map((item) => {
      const details = eventsById.get(String(item.eventId));
      return {
        ...item,
        eventName: details?.title || item.eventName,
        eventDate: details?.date || null,
        location: details?.location || "",
      };
    }),
  };
});
