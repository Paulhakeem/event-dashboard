import { Ticket } from "~~/server/models/Ticket";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import { CancelledTicket } from "~~/server/models/CancelledTickets";
import connectDB from "~~/server/utils/mongoose";
import { requireAuth } from "~~/server/utils/requireAuth";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  await connectDB();

  const { ticketId } = await readBody(event);
  const authUser = await requireAuth(event);
  const config = useRuntimeConfig();
  try {
    // 1. Find ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw createError({ statusCode: 404, message: "Ticket not found" });
    }

    // 2. Ensure the logged-in user owns the ticket (optional but recommended)
    if (ticket.userId.toString() !== authUser.id.toString()) {
      throw createError({ statusCode: 403, message: "Unauthorized action" });
    }

    // 3. Find user
    const user = await User.findById(ticket.userId);
    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }
    // 4. Find event
    const eventDetails = await Event.findById(ticket.eventId);
    if (!eventDetails) {
      throw createError({ statusCode: 404, message: "Event not found" });
    }
    // 5. Save cancelled ticket
    const cancelledTicket = new CancelledTicket({
      user: user._id,
      event: ticket.event,
      amount: ticket.amount,
    });
    await cancelledTicket.save();

    // 6. Delete ticket
    await Ticket.findByIdAndDelete(ticketId);

    // 7. Setup email transporter
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort),
      secure: false,
      auth: {
        user: config.emailUsername,
        pass: config.emailPass,
      },
    });

    // 8. Send email to user
    await transporter.sendMail({
      from: `"Velora Events" <${config.emailUsername}>`,
      to: user.email,
      subject: "Ticket Cancellation Confirmation",
      html: `
        <h2>Ticket Cancelled</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>Your ticket cancellation for ${eventDetails.name} has been processed.</p>
          <p><strong>You will be refunded:</strong> ${ticket.amount} <span style="color: red;">(This amount will be credited back to your account within 5-7 business days)</span></p>
        
        <br/>
        <p>Thank you.</p>
      `,
    });

    // 9. Send email to admin
    const admin = await User.findOne({ role: "admin" });

    await transporter.sendMail({
      from: `"Velora Events" <${config.emailUsername}>`,
      to: admin.email,
      subject: "Ticket Cancelled Notification",
      html: `
        <h3>Ticket Cancellation</h3>
        <p>A ticket has been cancelled for ${eventDetails.name}. Here are the user details:</p>
        <p><strong>User Name:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>User Email:</strong> ${user.email}</p>
        <p><strong>Refund Amount:</strong> ${ticket.amount}</p>
      `,
    });

    return {
      message:
        "Ticket cancelled, refund processed, and emails sent successfully",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message || "Something went wrong",
    });
  }
});
