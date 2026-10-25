import mongoose from "mongoose";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Event, getEventStartEnd } from "~~/server/models/Events.js";
import { Ticket } from "~~/server/models/Ticket.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);

  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }

  const body = await readBody(event);
  const ticketId = body?.ticketId;
  const used = body?.used;
  if (!mongoose.isValidObjectId(ticketId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid ticket id is required",
    });
  }
  if (used !== true) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tickets can only be marked as used",
    });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw createError({ statusCode: 404, statusMessage: "Ticket not found" });
  }

  if (ticket.used) {
    if (ticket.status !== "inactive") {
      ticket.status = "inactive";
      await ticket.save();
    }
    return { success: true, ticket };
  }

  if (ticket.status !== "active") {
    throw createError({
      statusCode: 409,
      statusMessage: "Only active tickets can be marked as used",
    });
  }

  const eventDetails = await Event.findById(ticket.eventId)
    .select("date startDate endDate startTime endTime")
    .lean();
  const eventWindow = getEventStartEnd(eventDetails || {});
  if (!eventWindow || eventWindow.end < new Date()) {
    ticket.status = "inactive";
    await ticket.save();
    throw createError({
      statusCode: 409,
      statusMessage: "This event has expired; the ticket is inactive",
    });
  }

  const updatedTicket = await Ticket.findOneAndUpdate(
    { _id: ticket._id, status: "active", used: false },
    {
      $set: {
        used: true,
        usedAt: new Date(),
        status: "inactive",
      },
    },
    { new: true, runValidators: true },
  ).lean();

  if (!updatedTicket) {
    throw createError({
      statusCode: 409,
      statusMessage: "Ticket status changed; refresh and try again",
    });
  }

  return { success: true, ticket: updatedTicket };
});
