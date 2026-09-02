import jwt from "jsonwebtoken";
import connectDB from "~~/server/utils/mongoose";
import { Event } from "~~/server/models/Events";
import { User } from "~~/server/models/User";
import { TotalBooking } from "~~/server/models/totalBooking";

const requireAdmin = (event) => {
  const header = getHeader(event, "authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  try {
    const user = jwt.verify(token, useRuntimeConfig().secretStr);
    if (user.role !== "admin") throw new Error();
    return user;
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }
};

const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const buildMonths = (start, end) => {
  const months = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor <= end) {
    months.push({
      key: monthKey(cursor),
      month: cursor.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      }),
      users: 0,
      bookings: 0,
      revenue: 0,
      refunds: 0,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
};

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  await connectDB();
  const query = getQuery(event);
  const end = query.endDate
    ? new Date(`${query.endDate}T23:59:59.999Z`)
    : new Date();
  const start = query.startDate
    ? new Date(`${query.startDate}T00:00:00.000Z`)
    : new Date(end.getFullYear(), end.getMonth() - 11, 1);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid report date range",
    });
  }

  const eventFilter = {};
  if (query.eventId) eventFilter._id = query.eventId;
  if (query.organiserId) eventFilter.createdBy = query.organiserId;
  const selectedEvents = await Event.find(eventFilter)
    .select("_id title createdBy")
    .populate("createdBy", "firstName lastName email");
  const eventNames = selectedEvents.map((item) => item.title);
  const bookingFilter = { bookedAt: { $gte: start, $lte: end } };
  if (eventNames.length || query.eventId || query.organiserId)
    bookingFilter.eventName = { $in: eventNames };

  const [users, bookings, paymentBreakdown] = await Promise.all([
    User.find({ createdAt: { $gte: start, $lte: end } }).select("createdAt"),
    TotalBooking.find(bookingFilter).select("eventName amount status bookedAt"),
    TotalBooking.aggregate([
      { $match: bookingFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  const months = buildMonths(start, end);
  const monthMap = Object.fromEntries(months.map((item) => [item.key, item]));
  users.forEach((user) => {
    const item = monthMap[monthKey(new Date(user.createdAt))];
    if (item) item.users += 1;
  });
  bookings.forEach((booking) => {
    const item = monthMap[monthKey(new Date(booking.bookedAt))];
    if (!item) return;
    if (["success", "confirmed"].includes(booking.status)) {
      item.bookings += 1;
      item.revenue += booking.amount || 0;
    }
    if (["cancelled", "refunded"].includes(booking.status))
      item.refunds += booking.amount || 0;
  });

  const eventMap = {};
  bookings.forEach((booking) => {
    const item = eventMap[booking.eventName] || {
      title: booking.eventName,
      bookings: 0,
      revenue: 0,
      refunds: 0,
    };
    if (["success", "confirmed"].includes(booking.status)) {
      item.bookings += 1;
      item.revenue += booking.amount || 0;
    }
    if (["cancelled", "refunded"].includes(booking.status))
      item.refunds += booking.amount || 0;
    eventMap[booking.eventName] = item;
  });

  const revenue = bookings
    .filter((item) => ["success", "confirmed"].includes(item.status))
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const refunds = bookings
    .filter((item) => ["cancelled", "refunded"].includes(item.status))
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  return {
    filters: {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    },
    organisers: [
      ...new Map(
        selectedEvents.map((item) => [
          String(item.createdBy?._id),
          item.createdBy,
        ]),
      ).values(),
    ].filter(Boolean),
    events: selectedEvents,
    summary: {
      revenue,
      refunds,
      netRevenue: revenue - refunds,
      bookings: bookings.filter((item) =>
        ["success", "confirmed"].includes(item.status),
      ).length,
      users: users.length,
      events: selectedEvents.length,
      averageBookingValue: bookings.length
        ? revenue /
          Math.max(
            1,
            bookings.filter((item) =>
              ["success", "confirmed"].includes(item.status),
            ).length,
          )
        : 0,
    },
    monthly: months,
    payments: paymentBreakdown.map((item) => ({
      status: item._id || "unknown",
      count: item.count,
      amount: item.amount || 0,
    })),
    eventPerformance: Object.values(eventMap).sort(
      (a, b) => b.revenue - a.revenue,
    ),
  };
});
