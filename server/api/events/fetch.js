import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import { TotalBooking } from "../../models/totalBooking.js";
import { markPastEventsCompleted } from "../../utils/eventStatus.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  // update event statuses based on current date
  await markPastEventsCompleted();
  try {
    const events = await Event.find().sort({date:1});

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

    const enriched = events.map((e) => {
      const obj = e.toObject();
      obj.ticketsSold = bookingMap[e.title] || 0;
      obj.ticketsRemaining = Math.max(0, (e.TicketQuantity || 0) - obj.ticketsSold);
      return obj;
    });

    return { success: true, events: enriched };
  } catch (error) {
    return { success: false, message: error.message };
  }
});