import connectDB from "../../utils/mongoose.js";
import { Ticket } from "../../models/Ticket.js";
import { Event, getEventStartEnd } from "../../models/Events.js";
import { requireAuth } from "../../utils/requireAuth.js";

const extractTicketCode = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";
  const match = /TKT-[A-Z0-9]+/i.exec(text);
  return match ? match[0].toUpperCase() : text;
};

export default defineEventHandler(async (event) => {
  const scanner = await requireAuth(event);
  if (!scanner || !["admin", "organiser"].includes(scanner.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Staff access required",
    });
  }
  const body = await readBody(event);
  const ticketCode = extractTicketCode(body?.ticketCode);

  await connectDB();

  if (!ticketCode) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket code is required",
    });
  }

  const existingTicket = await Ticket.findOne({ ticketCode });
  if (!existingTicket) {
    throw createError({ statusCode: 404, statusMessage: "Invalid ticket" });
  }

  if (existingTicket.used || existingTicket.status !== "active") {
    throw createError({
      statusCode: 400,
      statusMessage: existingTicket.used
        ? "Ticket already used; ticket is inactive"
        : "Ticket is not active",
    });
  }

  const ticketEvent = await Event.findById(existingTicket.eventId)
    .select("date startDate endDate startTime endTime")
    .lean();
  const eventWindow = getEventStartEnd(ticketEvent || {});
  if (!eventWindow || eventWindow.end < new Date()) {
    await Ticket.updateOne(
      { _id: existingTicket._id, status: "active" },
      { $set: { status: "inactive" } },
    );
    throw createError({
      statusCode: 400,
      statusMessage: "Event has expired; ticket is inactive",
    });
  }

  const ticket = await Ticket.findOneAndUpdate(
    { ticketCode, used: false, status: "active" },
    { $set: { used: true, usedAt: new Date(), status: "inactive" } },
    { new: true },
  ).populate("userId", "firstName lastName");

  if (!ticket) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket already used; ticket is inactive",
    });
  }

  return {
    message: "Ticket valid ✅ Entry allowed",
    ticket: {
      ticketCode: ticket.ticketCode,
      userName:
        `${ticket.userId?.firstName || ticket.firstName || ""} ${ticket.userId?.lastName || ticket.lastName || ""}`.trim() ||
        ticket.userEmail,
      eventName: ticket.eventName,
      ticketType: ticket.ticketType,
      usedAt: ticket.usedAt,
    },
  };
});
