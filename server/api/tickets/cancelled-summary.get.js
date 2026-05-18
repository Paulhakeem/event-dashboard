import { CancelledTicket } from "~~/server/models/CancelledTickets";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  await connectDB();

  try {
    const result = await CancelledTicket.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalRefunded: { $sum: "$amount" },
        },
      },
    ]);

    const summary = result[0] || { count: 0, totalRefunded: 0 };

    return {
      success: true,
      cancelledCount: summary.count,
      totalRefunded: summary.totalRefunded,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
