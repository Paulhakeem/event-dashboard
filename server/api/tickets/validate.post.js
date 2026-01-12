import connectDB from "~~/server/utils/mongoose";
import { Ticket } from "~~/server/models/Ticket";

export default defineEventHandler(async (event) => {
  const { ticketCode } = await readBody(event);

  await connectDB();

  const ticket = await Ticket.findOne({ ticketCode });

  if (!ticket) {
    throw createError({ statusCode: 404, statusMessage: "Invalid ticket" });
  }

  if (ticket.used) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket already used",
    });
  }

  ticket.used = true;
  await ticket.save();

  return {
    message: "Ticket valid ✅ Entry allowed",
    ticket,
  };
});
