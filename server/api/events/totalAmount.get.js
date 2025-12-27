import connectDB from "~~/server/utils/mongoose";
import { TotalBooking } from "~~/server/models/totalBooking";

export default defineEventHandler(async () => {
  await connectDB();
  try {
    const totalAmount = await TotalBooking.aggregate([
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" },
        },
      },
    ]);

    const total = totalAmount[0]?.amount || 0;
    return {
      success: true,
      total,
    };
  } catch (error) {
    return{
        success: false,
        message: error.message
    }
  }
});
