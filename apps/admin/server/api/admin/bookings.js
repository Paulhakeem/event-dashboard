import { TotalBooking } from "../../models/totalBooking.js";
import connectDB from "../../utils/mongoose.js";
import { requireAuth } from "../../utils/requireAuth.js";

const statuses = [
  "pending",
  "success",
  "confirmed",
  "cancelled",
  "failed",
  "refunded",
];
const refundStatuses = [
  "not_requested",
  "pending",
  "processing",
  "completed",
  "failed",
];
const disputeStatuses = [
  "none",
  "open",
  "investigating",
  "resolved",
  "rejected",
];

const requireAdmin = async (event) => {
  const user = await requireAuth(event);
  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }
  return user;
};

const buildFilter = (query) => {
  const filter = {};
  const search = String(query.search || "").trim();
  if (search) {
    const pattern = { $regex: search, $options: "i" };
    filter.$or = [
      { eventName: pattern },
      { userEmail: pattern },
      { reference: pattern },
      { transactionId: pattern },
      { mpesaReceiptNumber: pattern },
    ];
  }
  if (statuses.includes(query.status)) filter.status = query.status;
  if (refundStatuses.includes(query.refundStatus))
    filter.refundStatus = query.refundStatus;
  if (disputeStatuses.includes(query.disputeStatus))
    filter.disputeStatus = query.disputeStatus;
  if (query.eventName) filter.eventName = query.eventName;
  if (query.reconciled === "true" || query.reconciled === "false")
    filter.reconciled = query.reconciled === "true";
  if (query.startDate || query.endDate) {
    filter.bookedAt = {};
    if (query.startDate)
      filter.bookedAt.$gte = new Date(`${query.startDate}T00:00:00.000Z`);
    if (query.endDate)
      filter.bookedAt.$lte = new Date(`${query.endDate}T23:59:59.999Z`);
  }
  return filter;
};

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  await connectDB();
  const query = getQuery(event);

  if (event.node.req.method === "GET") {
    const filter = buildFilter(query);
    if (
      filter.bookedAt &&
      Object.values(filter.bookedAt).some((date) =>
        Number.isNaN(new Date(date).getTime()),
      )
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid booking date range",
      });
    }
    const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(query.limit, 10) || 25),
    );
    const [bookings, total, summaryRows, events] = await Promise.all([
      TotalBooking.find(filter)
        .sort({ bookedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      TotalBooking.countDocuments(filter),
      TotalBooking.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            gross: { $sum: "$amount" },
            successful: {
              $sum: {
                $cond: [{ $in: ["$status", ["success", "confirmed"]] }, 1, 0],
              },
            },
            successfulAmount: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["success", "confirmed"]] },
                  "$amount",
                  0,
                ],
              },
            },
            refundedAmount: { $sum: "$refundAmount" },
            pendingRefunds: {
              $sum: {
                $cond: [
                  { $in: ["$refundStatus", ["pending", "processing"]] },
                  1,
                  0,
                ],
              },
            },
            openDisputes: {
              $sum: {
                $cond: [
                  { $in: ["$disputeStatus", ["open", "investigating"]] },
                  1,
                  0,
                ],
              },
            },
            unreconciled: { $sum: { $cond: ["$reconciled", 0, 1] } },
          },
        },
      ]),
      TotalBooking.distinct("eventName"),
    ]);
    return {
      bookings,
      events: events.sort(),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: summaryRows[0] || {
        gross: 0,
        successful: 0,
        successfulAmount: 0,
        refundedAmount: 0,
        pendingRefunds: 0,
        openDisputes: 0,
        unreconciled: 0,
      },
    };
  }

  if (event.node.req.method !== "PATCH")
    throw createError({ statusCode: 405, statusMessage: "Method not allowed" });
  const body = await readBody(event);
  if (!body?.id || !body?.action)
    throw createError({
      statusCode: 400,
      statusMessage: "Booking id and action are required",
    });
  const booking = await TotalBooking.findById(body.id);
  if (!booking)
    throw createError({ statusCode: 404, statusMessage: "Booking not found" });
  const now = new Date();

  if (body.action === "request_refund") {
    if (!["success", "confirmed", "cancelled"].includes(booking.status))
      throw createError({
        statusCode: 400,
        statusMessage: "This booking is not eligible for a refund",
      });
    booking.refundStatus = "pending";
    booking.refundAmount = Math.max(
      0,
      Number(body.refundAmount ?? booking.amount),
    );
    booking.refundReason = String(body.reason || "Admin refund request").trim();
  } else if (body.action === "update_refund") {
    if (
      !refundStatuses.includes(body.refundStatus) ||
      body.refundStatus === "not_requested"
    )
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid refund status",
      });
    booking.refundStatus = body.refundStatus;
    if (body.refundAmount !== undefined)
      booking.refundAmount = Math.max(0, Number(body.refundAmount));
    if (body.refundReference !== undefined)
      booking.refundReference = String(body.refundReference).trim();
    if (body.reason !== undefined)
      booking.refundReason = String(body.reason).trim();
    if (body.refundStatus === "completed") {
      booking.status = "refunded";
      booking.refundProcessedAt = now;
    }
  } else if (body.action === "update_dispute") {
    if (!disputeStatuses.includes(body.disputeStatus))
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid dispute status",
      });
    booking.disputeStatus = body.disputeStatus;
    if (body.reason !== undefined)
      booking.disputeReason = String(body.reason).trim();
    if (body.note !== undefined) booking.disputeNote = String(body.note).trim();
    if (
      ["open", "investigating"].includes(body.disputeStatus) &&
      !booking.disputedAt
    )
      booking.disputedAt = now;
  } else if (body.action === "reconcile") {
    booking.reconciled = Boolean(body.reconciled);
    booking.reconciledAt = booking.reconciled ? now : null;
    booking.reconciliationNote = String(body.note || "").trim();
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "Unsupported booking action",
    });
  }

  booking.lastActionBy = admin.id;
  await booking.save();
  return { success: true, booking: booking.toObject() };
});
