import connectDB from "~~/server/utils/mongoose";
import { TotalBooking } from "~~/server/models/totalBooking";
import { requireAuth } from "~~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await connectDB();

  // 🔐 get logged-in user from JWT
  const user = requireAuth(event);

  try {
    const result = await TotalBooking.aggregate([
      {
        $match: {
          user: user.email, // ✅ must match stored userEmail
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    return {
      success: true,
      totalAmount: result[0]?.totalAmount || 0,
      totalBookings: result[0]?.totalBookings || 0,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
