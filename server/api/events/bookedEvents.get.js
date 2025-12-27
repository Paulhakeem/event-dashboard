import connectDB from "~~/server/utils/mongoose";
import { TotalBooking } from "~~/server/models/totalBooking";

export default defineEventHandler(async () => {
  await connectDB();

  try {
    const bookings = await TotalBooking.find().sort({ bookedAt: -1 });
    return {
      success: true,
      bookings,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
