import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth";
import connectDB from "~~/server/utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking";
import { Event } from "~~/server/models/Events.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = await requireAuth(event);
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  try {
    // check if user is organizer and delete events if they are an organizer
    if (user.role === "organiser") {
      await Event.deleteMany({ organizer: user.id });
    }

    // Delete the user
    await User.findByIdAndDelete(user.id);
    // Delete all bookings associated with the user
    await TotalBooking.deleteMany({ userId: user.id });
    return {
      message: "Profile and associated bookings deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw createError({
      statusCode: 500,
      message: "An error occurred while deleting the profile",
    });
  }
});
