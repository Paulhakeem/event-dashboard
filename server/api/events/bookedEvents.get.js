import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "../../models/totalBooking.js";

export default defineEventHandler(async () => {
  await connectDB();

  try {
    // get all bookings
    const bookings = await TotalBooking.find().sort({ bookedAt: 1 }).lean();

    // get stats per events (group by eventName)
    const stats = await TotalBooking.aggregate([
      {
        $group: {
          _id: { eventName: "$eventName", ticketType: "$ticketType" },
          count: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          uniqueUsers: { $addToSet: "$userEmail" },
        },
      },
      {
        $group: {
          _id: "$_id.eventName",
          ticketTypes: {
            $push: {
              name: "$_id.ticketType",
              count: "$count",
            },
          },
          totalRevenue: { $sum: "$totalRevenue" },
          uniqueUsers: { $addToSet: { $each: "$uniqueUsers" } },
          totalBookings: { $sum: "$count" },
        },
      },
      {
        $project: {
          _id: 0,
          eventName: "$_id",
          totalUsers: { $size: "$uniqueUsers" },
          totalRevenue: 1,
          totalBookings: 1,
          ticketTypes: 1,
        },
      },
    ]);

    return { success: true, events: stats };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
