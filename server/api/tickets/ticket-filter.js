import connectDB from "~~/server/utils/mongoose";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Ticket } from "~~/server/models/Ticket.js";
import { Event } from "~~/server/models/Events.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const user = await requireAuth(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    if (user.role !== "admin" && user.role !== "organiser") {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied. Admins and organisers only.",
      });
    }

    const { eventName, ticketType, used } = getQuery(event);

    let eventTitles = [];

    if (user.role === "admin") {
      // Admin sees tickets for ALL events — get all distinct event names
      eventTitles = await TotalBooking.distinct("eventName");
    } else {
      // Organiser — get only event names from their own events
      eventTitles = await TotalBooking.distinct("eventName", {
        organiserId: new mongoose.Types.ObjectId(user.id),
      });
    }

    if (!eventTitles.length) {
      return {
        success: true,
        tickets: [],
        total: 0,
        message: "No events found for this user.",
      };
    }

    // Build ticket filter
    const filter = {
      eventName: { $in: eventTitles },
    };

    // Optional: filter by specific event name
    if (eventName) {
      // Security: ensure organiser can only access their own event's tickets
      if (user.role !== "admin" && !eventTitles.includes(eventName)) {
        throw createError({
          statusCode: 403,
          statusMessage: "You do not have access to tickets for this event.",
        });
      }
      filter.eventName = eventName;
    }

    // Optional: filter by ticket type
    if (ticketType) {
      filter.ticketType = ticketType;
    }

    // Optional: filter by used status (convert query string to boolean)
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
