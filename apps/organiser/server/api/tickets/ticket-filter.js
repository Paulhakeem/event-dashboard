import connectDB from "~~/server/utils/mongoose";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Ticket } from "~~/server/models/Ticket.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";
import mongoose from "mongoose";
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
    const { eventName, ticketType, used } = { ...query, ...body };

    const eventTitles = await TotalBooking.distinct("eventName", {
      organiserId: new mongoose.Types.ObjectId(user.id),
    });

    if (!eventTitles.length) {
      return {
        success: true,
        tickets: [],
        total: 0,
        message: "No events found for this user.",
      };
    }

    const filter = { eventName: { $in: eventTitles } };

    if (eventName) {
      if (!eventTitles.includes(eventName)) {
        throw createError({
          statusCode: 403,
          statusMessage: "You do not have access to tickets for this event.",
        });
      }
      filter.eventName = eventName;
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
