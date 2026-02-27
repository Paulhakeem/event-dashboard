import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import { markPastEventsCompleted } from "../../utils/eventStatus.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  // ensure any events whose date has already passed are marked completed
  await markPastEventsCompleted();
  try {
    const events = await Event.find().sort({date:1}).limit(6);
    return { success: true, events };
  } catch (error) {
    return { success: false, message: error.message };
  }
});