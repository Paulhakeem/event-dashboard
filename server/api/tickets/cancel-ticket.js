import { Ticket } from "~~/server/models/Ticket";
import { User } from "~~/server/models/User";
import { Event } from "~~/server/models/Events";
import { Notification } from "~~/server/models/Notification";
import connectDB from "~~/server/utils/mongoose";
import { requireAuth } from "~~/server/utils/requireAuth";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  await connectDB();

  const { ticketId } = await readBody(event);
  const authUser = await requireAuth(event);
  const config = useRuntimeConfig();
  const smtpPort = Number(config.smtpPort || 587);
  try {
    // 1. Find ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw createError({ statusCode: 404, message: "Ticket not found" });
    }

    // 2. Ensure the logged-in user owns the ticket (optional but recommended)
    if (ticket.userId.toString() !== authUser.id?.toString()) {
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

    // change status from active to cancelled
    if (ticket.status !== "active") {
      throw createError({
        statusCode: 400,
        message: "This ticket has already been cancelled or used",
      });
    }

    const originalAmount = Number(ticket.amount || 0);
    const deduction = Number((originalAmount * 0.05).toFixed(2));
    const refundAmount = Number((originalAmount - deduction).toFixed(2));
    ticket.status = "cancelled";
    ticket.cancelledAt = new Date();
    await ticket.save();

    const organiser = eventDetails.createdBy
      ? await User.findOne({ _id: eventDetails.createdBy, role: "organiser" })
      : null;
    const cancellationDetails = {
      type: "ticket_cancelled",
      originalAmount,
      deduction,
      refundAmount,
    };

    try {
      await Notification.insertMany([
        {
          title: "Ticket cancellation confirmed",
          message: `Your ticket for "${eventDetails.title}" was cancelled. A refund of KES ${refundAmount.toFixed(2)} will be processed within 7 working days after a 5% deduction.`,
          recipientUser: user._id,
          event: eventDetails._id,
          meta: cancellationDetails,
          read: false,
        },
        {
          title: "Ticket cancelled",
          message: `${user.firstName || user.name || "A user"} cancelled a ticket for "${eventDetails.title}".`,
          recipientRole: "admin",
          event: eventDetails._id,
          meta: { ...cancellationDetails, userId: user._id },
          read: false,
        },
        ...(organiser
          ? [
              {
                title: "Event ticket cancelled",
                message: `A ticket for your event "${eventDetails.title}" was cancelled by ${user.firstName || user.name || "a user"}.`,
                recipientRole: "organiser",
                recipientUser: organiser._id,
                event: eventDetails._id,
                meta: { ...cancellationDetails, userId: user._id },
                read: false,
              },
            ]
          : []),
      ]);
    } catch (notificationError) {
      console.error(
        "Failed to create cancellation notifications:",
        notificationError,
      );
    }

    // 7. Setup email transporter
    let transporter = null;
    if (config.smtpHost && config.emailUsername && config.emailPass) {
      transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: config.emailUsername,
          pass: config.emailPass,
        },
      });
    }

    let emailNote = "";

    // 8. Send email to user
    if (transporter && user.email) {
      await transporter.sendMail({
        from: `"Velora Events" <${config.emailUsername}>`,
        to: user.email,
        subject: "Ticket Cancellation Confirmation",
        html: `
        <h2>Ticket Cancelled</h2>
        <p>Hello ${user.name},</p>
        <p>Your ticket cancellation for <strong>${eventDetails.title}</strong> has been completed.</p>
        <p><strong>Original amount:</strong> KES ${originalAmount.toFixed(2)}</p>
        <p><strong>Cancellation deduction (5%):</strong> KES ${deduction.toFixed(2)}</p>
        <p><strong>Refund amount:</strong> KES ${refundAmount.toFixed(2)}</p>
        <p style="margin-top: 0.5rem;">
          Your refund will be processed to your original payment method within 7 working days, depending on your bank or payment provider.
        </p>
        <p style="margin-top: 0.5rem; color: #555;">
          If you do not receive this confirmation email within 10 minutes, please check your spam folder or contact support.
        </p>
        <br/>
        <p>Thank you for using Velora Events.</p>
      `,
      });

      // 9. Send email to admin
      const admin = await User.findOne({ role: "admin" });

      if (admin) {
        await transporter.sendMail({
          from: `"Velora Events" <${config.emailUsername}>`,
          to: admin.email,
          subject: "Ticket Cancelled Notification",
          html: `
          <h3>Ticket Cancellation</h3>
          <p>A ticket has been cancelled for <strong>${eventDetails.title}</strong>. Here are the user details:</p>
          <p><strong>User Name:</strong> ${user.firstName || user.name || "User"}</p>
          <p><strong>User Email:</strong> ${user.email}</p>
            <p><strong>Refund Amount:</strong> KES ${refundAmount.toFixed(2)}</p>
            <p><strong>Cancellation Deduction:</strong> KES ${deduction.toFixed(2)} (5%)</p>
        `,
        });
      }
    } else if (!transporter) {
      emailNote =
        " Email notifications were not sent because SMTP is not configured.";
    } else if (!user.email) {
      emailNote =
        " Email notifications were not sent because the user has no email address.";
    }

    return {
      message: `Ticket cancelled. Refund of KES ${refundAmount.toFixed(2)} will be processed within 7 working days after a 5% deduction.${emailNote}`,
      refundAmount,
      deduction,
    };
  } catch (error) {
    const statusCode = error?.statusCode || error?.status || 500;
    throw createError({
      statusCode,
      message: error?.message || "Something went wrong",
    });
  }
});
