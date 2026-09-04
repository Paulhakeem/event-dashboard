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

    if (!transporter) {
      emailNote =
        " Email notifications were not sent because SMTP is not configured.";
    } else {
      const holderName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
      const refundSummary = `
        <p><strong>Original amount:</strong> KES ${originalAmount.toFixed(2)}</p>
        <p><strong>Cancellation deduction (5%):</strong> KES ${deduction.toFixed(2)}</p>
        <p><strong>Total refund:</strong> KES ${refundAmount.toFixed(2)}</p>
        <p>Your refund will be processed within 7 working days.</p>`;
      const from = `"Velora Events" <${config.emailUsername}>`;

      const emailJobs = [];
      if (user.email) {
        emailJobs.push({
          to: user.email,
          subject: "Ticket Cancellation Confirmation",
          html: `<h2>Ticket Cancelled</h2><p>Hello ${holderName},</p><p>Your ticket for <strong>${eventDetails.title}</strong> has been cancelled.</p>${refundSummary}<p>Thank you for using Velora Events.</p>`,
        });
      }

      const admins = await User.find({ role: "admin" }).select("email").lean();
      admins
        .filter((admin) => admin.email)
        .forEach((admin) => {
          emailJobs.push({
            to: admin.email,
            subject: "Ticket Cancelled Notification",
            html: `<h3>Ticket Cancellation</h3><p><strong>${holderName}</strong> cancelled a ticket for <strong>${eventDetails.title}</strong>.</p><p><strong>User email:</strong> ${user.email}</p>${refundSummary}`,
          });
        });

      if (organiser?.email) {
        emailJobs.push({
          to: organiser.email,
          subject: "Ticket Cancelled For Your Event",
          html: `<h3>Ticket Cancellation</h3><p>${holderName} cancelled a ticket for your event, <strong>${eventDetails.title}</strong>.</p><p><strong>User email:</strong> ${user.email}</p>${refundSummary}`,
        });
      }

      const deliveryResults = await Promise.allSettled(
        emailJobs.map((mail) => transporter.sendMail({ from, ...mail })),
      );
      const failedEmails = deliveryResults.filter(
        (result) => result.status === "rejected",
      ).length;
      if (failedEmails) {
        emailNote = ` ${failedEmails} cancellation email(s) could not be delivered.`;
        console.error("Cancellation email delivery failure:", deliveryResults);
      }
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
