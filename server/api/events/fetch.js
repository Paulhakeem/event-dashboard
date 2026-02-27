import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import { markPastEventsCompleted } from "../../utils/eventStatus.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  // update event statuses based on current date
  await markPastEventsCompleted();
  try {
    const events = await Event.find().sort({date:1});
    return { success: true, events };
  } catch (error) {
    return { success: false, message: error.message };
  }
});