import { Event } from "../../models/Events.js";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const method = event.node.req.method;
  try {
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
    // methode not found
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
