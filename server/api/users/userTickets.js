import connectDB from "~~/server/utils/mongoose";
import { Ticket } from "../../models/Ticket.js";
import { requireAuth } from "~~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await connectDB();

  // 🔐 Protect this route only
  const user = requireAuth(event);

  try {
    const bookings = await Ticket.find({userEmail: user.email})
      .populate("eventName")
      .sort({ bookedAt: -1 })
      .lean();

    return {
      success: true,
      bookings,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
