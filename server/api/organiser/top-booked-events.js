import { TotalBooking } from "~~/server/models/totalBooking";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);

  if (!user || user.role !== "organiser") {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied. Organisers only.",
    });
  }

  //   get the top booked events for the organiser
  try {
    const topBookedEvents = await TotalBooking.aggregate([
      { $match: { organiserId: user.id, status: "success" } },
      {
        $group: {
          _id: "$eventName",
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          eventName: "$_id",
          totalBookings: 1,
        },
      },
    ]);
    return {
      success: true,
      topBookedEvents,
    };
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err.message,
    });
  }
});
