import { requireAuth } from "~~/server/utils/requireAuth.js";
import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "../../models/totalBooking.js";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  await connectDB();
  try {
    const totalAmount = await TotalBooking.aggregate([
      { $match: { status: { $in: ["success", "confirmed"] } } },
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" },
        },
      },
    ]);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setHours(0, 0, 0, 0);

    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 11);

    const monthlyAmount = await TotalBooking.aggregate([
      {
        $match: {
          status: { $in: ["success", "confirmed"] },
          bookedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$bookedAt" },
            month: { $month: "$bookedAt" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyBreakdown = [];
    const monthLookup = new Map(
      monthlyAmount.map((item) => {
        const monthKey = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
        return [monthKey, item.amount || 0];
      }),
    );

    let cursor = new Date(startDate);
    while (cursor <= endDate) {
      const monthKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      monthlyBreakdown.push({
        monthKey,
        label: cursor.toLocaleDateString("en", {
          month: "short",
          year: "numeric",
        }),
        totalRevenue: monthLookup.get(monthKey) || 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const total = totalAmount[0]?.amount || 0;
    return {
      success: true,
      total,
      monthlyBreakdown,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
