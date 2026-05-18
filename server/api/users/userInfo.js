import connectDB from "~~/server/utils/mongoose.js";
import { TotalBooking } from "../../models/totalBooking.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  // 🔐 Protect this route only
  const user = requireAuth(event);

  try {
    const bookings = await TotalBooking.find({userEmail: user.email})
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
