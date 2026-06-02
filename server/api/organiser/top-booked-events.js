import mongoose from "mongoose";
import { TotalBooking } from "~~/server/models/totalBooking";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const user = await requireAuth(event);

    if (!user || user.role !== "organiser") {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied. Organisers only.",
      });
    }

    const topBookedEvents = await TotalBooking.aggregate([
      {
        $match: {
          organiserId: new mongoose.Types.ObjectId(user.id),
          status: { $in: ["success", "confirmed"] },
        },
      },
      {
        $group: {
          _id: "$eventName",
          totalBookings: { $sum: 1 },
          totalIncome: { $sum: "$amount" },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          eventName: "$_id",
          totalBookings: 1,
          totalIncome: 1,
        },
      },
    ]);

    return { success: true, topBookedEvents };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage:
        err.statusMessage || err.message || "Internal server error",
    });
  }
});
