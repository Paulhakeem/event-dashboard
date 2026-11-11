import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import { TotalBooking } from "../../models/totalBooking.js";
import { markPastEventsCompleted } from "../../utils/eventStatus.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  // update event statuses based on current date
  await markPastEventsCompleted();
  try {
    const query = getQuery(event);
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;
    const events = await Event.find({ status: { $ne: "pending" } })
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    // attach ticket booking counts per event
    const bookings = await TotalBooking.aggregate([
      {
        $group: {
          _id: "$eventName",
          ticketsSold: { $sum: 1 },
        },
      },
    ]);
    const bookingMap = {};
    for (const b of bookings) {
      bookingMap[b._id] = b.ticketsSold;
    }

    const config = useRuntimeConfig();
    const baseUrl = (config.appUrl || config.public?.appUrl || process.env.APP_URL || "https://happitwineventslimited.co.ke").replace(/\/$/, "");
    const enriched = events.map((e) => {
      const obj = e.toObject();
      obj.ticketsSold = bookingMap[e.title] || 0;
      obj.ticketsRemaining = Math.max(0, (e.TicketQuantity || 0) - obj.ticketsSold);
      obj.shareUrl = obj.shareUrl || `${baseUrl}/events/${obj._id}`;
      return obj;
    });

    const total = await Event.countDocuments({ status: { $ne: "pending" } });
    return { success: true, events: enriched, total };
  } catch (error) {
    return { success: false, message: error.message };
  }
});