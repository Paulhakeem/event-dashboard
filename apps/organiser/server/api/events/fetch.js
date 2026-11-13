import mongoose from "mongoose";
import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import { TotalBooking } from "../../models/totalBooking.js";
import { markPastEventsCompleted } from "../../utils/eventStatus.js";
import { requireAuth } from "../../utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const user = await requireAuth(event);
  if (user.role !== "organiser") {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  // update event statuses based on current date
  await markPastEventsCompleted();

  try {
    const query = getQuery(event);
    const limit = parseInt(query.limit) || 10;
    const skip = parseInt(query.skip) || 0;

    // Only ever return events created by the signed-in organiser.
    const filter = { createdBy: user.id };
    if (query.status) {
      filter.status = String(query.status);
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach ticket booking counts from this organiser's bookings only, so
    // one organiser never sees another organiser's sales.
    const bookings = await TotalBooking.aggregate([
      {
        $match: {
          organiserId: new mongoose.Types.ObjectId(user.id),
        },
      },
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
    const baseUrl = (
      config.appUrl ||
      config.public?.appUrl ||
      process.env.APP_URL ||
      "https://happitwineventslimited.co.ke"
    ).replace(/\/$/, "");
    const enriched = events.map((e) => {
      const obj = { ...e };
      obj.ticketsSold = bookingMap[e.title] || 0;
      obj.ticketsRemaining = Math.max(
        0,
        (e.TicketQuantity || 0) - obj.ticketsSold,
      );
      obj.shareUrl = obj.shareUrl || `${baseUrl}/events/${obj._id}`;
      return obj;
    });

    const total = await Event.countDocuments(filter);
    return { success: true, events: enriched, total };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    });
  }
});
