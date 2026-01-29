
import connectDB from "~~/server/utils/mongoose.js";
import { Event } from "~~/server/models/Events";

export default defineEventHandler(async (event) => {
  await connectDB();
  
  const query = getQuery(event);
  const search = query.q?.trim()
  
  if (!search) {
    return {success:true, events: [] };
  }

  try {
    const events = await Event.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      }).sort({ createdAt: -1 }).lean();

    return { success: true, events };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
