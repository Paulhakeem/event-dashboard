import connectDB from "../../utils/mongoose.js";
import { Ticket } from "../../models/Ticket.js";

// This endpoint validates a ticket by its ticketCode
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { ticketCode } = body;
  await connectDB();
  if (!ticketCode) {
    throw createError({
      statusCode: 400,
      statusMessage: "ticketCode is required",
    });
  }

  const ticket = await Ticket.findOne({ ticketCode });
  if (!ticket) {
    throw createError({
      statusCode: 404,
      statusMessage: "Ticket not found",
    });
  }
  if (ticket.used) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket has already been used",
    });
  }
  // Mark the ticket as used
  ticket.used = true;
  await ticket.save();
  return {
    message: "Ticket validated successfully",
    ticket,
  };
});
