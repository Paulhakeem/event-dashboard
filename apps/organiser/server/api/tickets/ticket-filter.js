import connectDB from "~~/server/utils/mongoose";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Ticket } from "~~/server/models/Ticket.js";
import { Event } from "~~/server/models/Events.js";
import { syncTicketStatuses } from "~~/server/utils/syncTicketStatuses.js";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const user = await requireAuth(event);
    await syncTicketStatuses();

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    if (user.role !== "organiser") {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied. Organisers only.",
      });
    }

    const body = await readBody(event).catch(() => ({}));
    const query = getQuery(event);
    const { eventId, eventName, ticketType, used } = { ...query, ...body };
    const events = await Event.find({ createdBy: user.id })
      .select("_id title")
      .lean();
    const eventIds = events.map((item) => item._id);

    if (!eventIds.length) {
      return {
        success: true,
        tickets: [],
        total: 0,
        message: "No events found for this user.",
      };
    }

    const filter = { eventId: { $in: eventIds } };

    if (eventId) {
      const ownedEvent = events.find(
        (item) => String(item._id) === String(eventId),
      );
      if (!ownedEvent) {
        throw createError({
          statusCode: 403,
          statusMessage: "You do not have access to tickets for this event.",
        });
      }
      filter.eventId = ownedEvent._id;
    } else if (eventName) {
      const ownedTitles = events
        .filter((item) => item.title === eventName)
        .map((item) => item.title);
      if (!ownedTitles.length) {
        throw createError({
          statusCode: 403,
          statusMessage: "You do not have access to tickets for this event.",
        });
      }
      filter.eventName = { $in: ownedTitles };
    }

    if (ticketType) {
      filter.ticketType = ticketType;
    }

    if (used !== undefined) {
      filter.used = used === "true";
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).lean();

    return { success: true, tickets, total: tickets.length };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage:
        err.statusMessage || err.message || "Internal server error",
    });
  }
});
