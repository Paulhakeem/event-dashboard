import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "../../models/totalBooking.js";
import { Event } from "../../models/Events.js";

export default defineEventHandler(async () => {
  await connectDB();

  try {
    const stats = await TotalBooking.aggregate([
      // Stage 1: group by eventName + ticketType
      {
        $group: {
          _id: { eventName: "$eventName", ticketType: "$ticketType" },
          count: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          uniqueUsers: { $addToSet: "$userEmail" },
        },
      },

      // Stage 2: unwind uniqueUsers so we can re-collect them cleanly
      // FIX: $addToSet: { $each: array } is invalid in $group.
      // The correct approach is to $unwind the array from stage 1,
      // then use $addToSet on the scalar value in stage 3.
      { $unwind: "$uniqueUsers" },

      // Stage 3: group by eventName, now $addToSet works on a scalar
      {
        $group: {
          _id: "$_id.eventName",
          customTickets: {
            $push: {
              name: "$_id.ticketType",
              count: "$count",
            },
          },
          totalRevenue: { $sum: "$totalRevenue" },
          uniqueUsers: { $addToSet: "$uniqueUsers" }, // ✅ scalar, valid
          totalBookings: { $sum: "$count" },
        },
      },

      // Stage 4: shape the output
      {
        $project: {
          _id: 0,
          eventName: "$_id",
          totalUsers: { $size: "$uniqueUsers" },
          totalRevenue: 1,
          totalBookings: 1,
          customTickets: 1,
        },
      },
    ]);

    // Enrich with ticket prices from the Events model
    const events = await Event.find(
      { title: { $in: stats.map((s) => s.eventName) } },
      "title customTickets",
    ).lean();

    const priceMap = {};
    events.forEach((ev) => {
      priceMap[ev.title] = {};
      (ev.customTickets || []).forEach((t) => {
        priceMap[ev.title][t.name] = t.price;
      });
    });

    const enriched = stats.map((s) => ({
      ...s,
      customTickets: (s.customTickets || []).map((t) => ({
        ...t,
        price: priceMap[s.eventName]?.[t.name] ?? 0,
      })),
    }));

    return { success: true, events: enriched };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
