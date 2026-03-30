import { Ticket } from "~~/server/models/Ticket";
import { User } from "~~/server/models/User";
import { CancelledTicket } from "~~/server/models/CancelledTickets";
import connectDB from "~~/server/utils/mongoose";
import { requireAuth } from "~~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await connectDB();
  const { ticketId } = await readBody(event);
  await requireAuth(event);
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw createError({ statusCode: 404, message: "Ticket not found" });
    }
    // Refund the ticket amount to the user's balance
    const user = await User.findById(ticket.userId);
    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }
    // create a cancelled ticket record
    const cancelledTicket = new CancelledTicket({
      user: ticket.user,
      event: ticket.event,
      amount: ticket.amount,
    });
    await cancelledTicket.save();
    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketId);
    return { message: "Ticket cancelled and amount refunded successfully" };
  } catch (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
});
