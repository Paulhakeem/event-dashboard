import mongoose from "mongoose";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Event, getEventStartEnd } from "~~/server/models/Events.js";
import { Ticket } from "~~/server/models/Ticket.js";
import { syncTicketStatuses } from "~~/server/utils/syncTicketStatuses.js";
import { getEventTicketMetrics } from "~~/server/utils/getEventTicketMetrics.js";

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
        .select("title date startDate endDate startTime endTime location createdBy")
        .populate("createdBy", "firstName lastName email")
        .lean(),
      Ticket.find({ eventId })
        .populate("userId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    if (!eventDetails) {
      throw createError({ statusCode: 404, statusMessage: "Event not found" });
    }

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

  const eventDetails = await Event.find()
    .select("title date startDate location createdBy")
    .populate("createdBy", "firstName lastName email")
    .sort({ date: 1 })
    .lean();
  const summaryByEvent = await getEventTicketMetrics(
    eventDetails.map((item) => item._id),
  );

  return {
    events: eventDetails.map((details) => {
      const item = summaryByEvent.get(String(details._id));
      const organiser = details.createdBy || {};
      return {
        eventId: String(details._id),
        eventName: details.title,
        eventDate: details.startDate || details.date || null,
        location: details.location || "",
        organiserName:
          `${organiser.firstName || ""} ${organiser.lastName || ""}`.trim() ||
          organiser.email ||
          "Unknown organiser",
        organiserEmail: organiser.email || "",
        totalTickets: item?.totalTickets || 0,
        totalAmount: item?.revenueCollected || 0,
        activeTickets: item?.activeTickets || 0,
        inactiveTickets: item?.inactiveTickets || 0,
        usedTickets: item?.usedTickets || 0,
      };
    }),
  };
});
