import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "../../models/totalBooking.js";

export default defineEventHandler(async () => {
  await connectDB();

  try {
    // get all bookings
    const bookings = await TotalBooking.find().sort({ bookedAt: 1 }).lean();

    // get stats per events (group by eventName & userEmail)
    const stats = await TotalBooking.aggregate([
      {
        $group: {
          _id: "$eventName",
          uniqueUsers: { $addToSet: "$userEmail" },
          totalRevenue: { $sum: "$amount" },
          regular: {
            $sum: { $cond: [{ $eq: ["$ticketType", "regular"] }, 1, 0] },
          },
          vip: {
            $sum: { $cond: [{ $eq: ["$ticketType", "vip"] }, 1, 0] },
          },
          vvip: {
            $sum: { $cond: [{ $eq: ["$ticketType", "vvip"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          eventName: "$_id",
          totalUsers: { $size: "$uniqueUsers" },
          totalRevenue: 1,
          regular: 1,
          vip: 1,
          vvip: 1,
        },
      },
    ]);

    // converts stats to a map keyed by eventName
    const statsMap = {};
    stats.forEach((s) => {
      statsMap[s.eventName] = s;
    });

    // Return a de-duplicated events summary (top-level stats per event)
    return {
      success: true,
      events: stats,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
