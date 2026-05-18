import connectDB from "~~/server/utils/mongoose.js";
import { Ticket } from "../../models/Ticket.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  // 🔐 Protect this route only
  const user = requireAuth(event);
  if (!user?.email) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const tickets = await Ticket.find({ userEmail: user?.email })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      tickets,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
