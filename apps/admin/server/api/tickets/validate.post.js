import connectDB from "../../utils/mongoose.js";
import { Ticket } from "../../models/Ticket.js";
import { Event } from "../../models/Events.js";
import { requireAuth } from "../../utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const scanner = await requireAuth(event);
  if (!scanner || !["admin", "organiser"].includes(scanner.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Staff access required",
    });
  }
  const { ticketCode } = await readBody(event);

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

  const ticketEvent = await Event.findById(existingTicket.eventId)
    .select("date")
    .lean();
  if (!ticketEvent || new Date(ticketEvent.date) < new Date()) {
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
    const currentTicket = await Ticket.findById(existingTicket._id);
    if (currentTicket?.used) {
      await Ticket.updateOne(
        { _id: existingTicket._id, status: "active" },
        { $set: { status: "inactive" } },
      );
      throw createError({
        statusCode: 400,
        statusMessage: "Ticket already used; ticket is inactive",
      });
    }
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket is not active",
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
