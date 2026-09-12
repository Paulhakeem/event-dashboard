import connectDB from "../../utils/mongoose.js";
import { Ticket } from "../../models/Ticket.js";
import { requireAuth } from "../../utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const scanner = requireAuth(event);
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

  const ticket = await Ticket.findOneAndUpdate(
    { ticketCode, used: false, status: "active" },
    { $set: { used: true, usedAt: new Date() } },
    { new: true },
  ).populate("userId", "firstName lastName");

  if (!ticket) {
    const existingTicket = await Ticket.findOne({ ticketCode });
    if (!existingTicket) {
      throw createError({ statusCode: 404, statusMessage: "Invalid ticket" });
    }
    throw createError({
      statusCode: 400,
      statusMessage: existingTicket.used
        ? "Ticket already used"
        : "Ticket is not active",
    });
  }

  return {
    message: "Ticket valid ✅ Entry allowed",
    ticket: {
      ticketCode: ticket.ticketCode,
      userName:
        `${ticket.userId?.firstName || ""} ${ticket.userId?.lastName || ""}`.trim(),
      eventName: ticket.eventName,
      ticketType: ticket.ticketType,
      usedAt: ticket.usedAt,
    },
  };
});
