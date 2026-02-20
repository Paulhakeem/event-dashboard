import { Event } from "../../models/Events.js";
import { Notification } from "../../models/Notification.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const method = event.node.req.method;
  
  try {
    await connectDB();
    
    if (method === "GET") {
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
      const deleteEvent = await Event.findByIdAndDelete(id);
      if (!deleteEvent) {
        throw createError({
          statusCode: 404,
          statusMessage: "Event not found",
        });
      }
      return {
        success: true,
        message: "Event deleted successfully",
      };
    }

    // Update event fields
    if (method === "PATCH") {
      const body = await readBody(event);
      const allowed = [
        "image",
        "title",
        "description",
        "date",
        "location",
        "TicketQuantity",
        "regular",
        "vip",
        "vvip",
        "status",
        "eventType",
      ];
      const update = {};
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          update[key] = body[key];
        }
      }
      if (Object.keys(update).length === 0) {
        throw createError({ statusCode: 400, statusMessage: "No valid fields to update" });
      }

      // Get the current event to check if status is changing
      const currentEvent = await Event.findById(id);
      const eventTitle = body.title || currentEvent?.title || "Event";
      // treat transition from 'pending' -> 'upcoming' as approval
      const isApproved = body.status === "upcoming" && currentEvent?.status === "pending";

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
    return {
      statusCode: error.statusCode || 500,
      statusMessage: error.message,
    };
  }
});
