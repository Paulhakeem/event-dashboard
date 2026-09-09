import { Event } from "../../models/Events.js";
import { Notification } from "../../models/Notification.js";
import { Ticket } from "../../models/Ticket.js";
import connectDB from "../../utils/mongoose.js";
import { markPastEventsCompleted } from "../../utils/eventStatus.js";
import { requireAuth } from "../../utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const method = event.node.req.method;

  try {
    await connectDB();

    if (method === "GET") {
      // make sure status is up-to-date before returning individual event
      await markPastEventsCompleted();
      const eventData = await Event.findById(id).exec();
      if (!eventData) {
        throw createError({
          statusCode: 404,
          statusMessage: "Event not found",
        });
      }
      return { success: true, eventData };
    }

    if (method === "DELETE") {
      const authUser = await requireAuth(event);
      const currentEvent = await Event.findById(id);
      if (!currentEvent) {
        throw createError({
          statusCode: 404,
          statusMessage: "Event not found",
        });
      }
      if (
        authUser.role !== "admin" &&
        String(currentEvent.createdBy) !== String(authUser.id)
      ) {
        throw createError({ statusCode: 403, statusMessage: "Access denied" });
      }
      await Event.deleteOne({ _id: currentEvent._id });
      return {
        success: true,
        message: "Event deleted successfully",
      };
    }

    // Update event fields
    if (method === "PATCH") {
      const authUser = await requireAuth(event);
      const body = await readBody(event);
      const allowed = [
        "image",
        "title",
        "description",
        "date",
        "location",
        "TicketQuantity",
        "customTickets",
        "status",
        "eventType",
        "freeEntry",
      ];
      const update = {};
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          update[key] = body[key];
        }
      }
      if (Object.keys(update).length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: "No valid fields to update",
        });
      }

      // Get the current event to check if status is changing
      const currentEvent = await Event.findById(id);
      if (!currentEvent) {
        throw createError({
          statusCode: 404,
          statusMessage: "Event not found",
        });
      }
      if (
        authUser.role !== "admin" &&
        String(currentEvent.createdBy) !== String(authUser.id)
      ) {
        throw createError({ statusCode: 403, statusMessage: "Access denied" });
      }
      const eventTitle = body.title || currentEvent?.title || "Event";
      // treat transition from 'pending' -> 'upcoming' as approval
      const isApproved =
        body.status === "upcoming" && currentEvent?.status === "pending";
      const isCancelled =
        body.status === "cancelled" && currentEvent?.status !== "cancelled";

      const updatedEvent = await Event.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      if (!updatedEvent) {
        throw createError({
          statusCode: 404,
          statusMessage: "Event not found",
        });
      }

      // Create notification for organiser if event is approved
      if (isApproved && updatedEvent.createdBy) {
        try {
          const notification = new Notification({
            title: "Event Approved",
            message: `Your event "${eventTitle}" has been approved and is now live!`,
            recipientRole: "organiser",
            recipientUser: updatedEvent.createdBy,
            event: updatedEvent._id,
            read: false,
          });
          await notification.save();
        } catch (err) {
          console.error("Failed to create approval notification:", err);
        }
      }

      if (isApproved) {
        try {
          await Notification.create({
            title: "New event available",
            message: `A new event, "${updatedEvent.title}", is now available to browse and book.`,
            recipientRole: "user",
            event: updatedEvent._id,
            meta: { type: "new_event" },
            read: false,
          });
        } catch (err) {
          console.error("Failed to create new-event notifications:", err);
        }
      }

      if (isCancelled) {
        if (updatedEvent.createdBy) {
          await Notification.create({
            title: "Event Cancelled",
            message: `Your event "${updatedEvent.title}" has been cancelled by an administrator.`,
            recipientRole: "organiser",
            recipientUser: updatedEvent.createdBy,
            event: updatedEvent._id,
            meta: { type: "event_cancelled" },
            read: false,
          });
        }
        try {
          const ticketHolders = await Ticket.find({
            eventId: updatedEvent._id,
          }).distinct("userId");
          if (ticketHolders.length) {
            await Notification.insertMany(
              ticketHolders.map((recipientUser) => ({
                title: "Event cancelled",
                message: `The event "${updatedEvent.title}" has been cancelled.`,
                recipientUser,
                event: updatedEvent._id,
                meta: { type: "event_cancelled" },
                read: false,
              })),
            );
          }
        } catch (err) {
          console.error("Failed to create cancellation notifications:", err);
        }
      }

      return {
        success: true,
        message: `Event updated successfully`,
        updatedEvent,
      };
    }

    // Method not allowed
    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    });
  }
});
