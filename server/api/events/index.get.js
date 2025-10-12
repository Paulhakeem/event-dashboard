import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  try {
    const events = await Event.find();
    return { success: true, events };
  } catch (error) {
    return { success: false, message: error.message };
  }
});