import { Ticket } from "../models/Ticket.js";
import { TotalBooking } from "../models/totalBooking.js";

export async function getEventTicketMetrics(eventIds) {
  if (!eventIds.length) return new Map();

  const groupedTickets = await Ticket.aggregate([
    { $match: { eventId: { $in: eventIds } } },
    {
      $group: {
        _id: { eventId: "$eventId", bookingId: "$bookingId" },
        totalTickets: { $sum: 1 },
        activeTickets: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        inactiveTickets: {
          $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
        },
        usedTickets: { $sum: { $cond: ["$used", 1, 0] } },
      },
    },
    {
      $lookup: {
        from: TotalBooking.collection.name,
        localField: "_id.bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id.eventId",
        bookings: { $sum: 1 },
        totalTickets: { $sum: "$totalTickets" },
        activeTickets: { $sum: "$activeTickets" },
        inactiveTickets: { $sum: "$inactiveTickets" },
        usedTickets: { $sum: "$usedTickets" },
        revenueCollected: {
          $sum: {
            $cond: [
              { $in: ["$booking.status", ["success", "confirmed"]] },
              { $ifNull: ["$booking.amount", 0] },
              0,
            ],
          },
        },
      },
    },
  ]);

  return new Map(
    groupedTickets.map((item) => [String(item._id), item]),
  );
}
