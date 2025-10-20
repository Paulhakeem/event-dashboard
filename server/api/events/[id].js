import { Event } from "../../models/Events.js";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  try {
    const eventData = await Event.findById(id).exec();
    if (!eventData) {
      return {
        statusCode: 404,
        body: { message: "Event not found" },
      };
    }
    return {
      statusCode: 200,
      eventData,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: "Internal Server Error", error: error.message },
    };
  }
});
