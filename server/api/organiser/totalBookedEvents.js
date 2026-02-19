import { TotalBooking } from "~~/server/models/totalBooking";
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

    // get all the booked events for the organiser
    try {
        const bookings = await TotalBooking.find({ organiserId: user.id, status: { $in: ["success"] } });
        return {
            success: true,
            totalBookedEvents: bookings.length,
        };
    } catch (err) {
        throw createError({
            statusCode: 500,
            message: err.message,
        });
    }
  
})