import { TotalBooking } from "~~/server/models/totalbooking";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  if (user.role !== "organiser") {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  try {
    const bookings = await TotalBooking.find({
      organiserEmail: user.email,
    }).sort({ createdAt: -1 });
    return { bookings };
  } catch (err) {
    throw createError({ statusCode: 500, message: err.message });
  }
});
