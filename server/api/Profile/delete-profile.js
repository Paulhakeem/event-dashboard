import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth";
import connectDB from "~~/server/utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking";
import { Event } from "~~/server/models/Events.js";
import { Ticket } from "~~/server/models/Ticket";
import { CancelledTicket } from "~~/server/models/CancelledTickets";
import { Notification } from "~~/server/models/Notification";

export default defineEventHandler(async (event) => {
  await connectDB();
  const authUser = await requireAuth(event);
  if (!authUser) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  try {
    const userId = authUser.id;

    // Delete events created by the user (any role that creates events)
    await Event.deleteMany({ createdBy: userId });

    // Delete bookings where the user was the booker or the organiser
    await TotalBooking.deleteMany({
      $or: [{ createdBy: userId }, { organiserId: userId }],
    });

    // Delete tickets owned by the user
    await Ticket.deleteMany({ userId });

    // Delete cancelled ticket records linked to the user
    await CancelledTicket.deleteMany({ user: userId });

    // Delete notifications addressed to the user
    await Notification.deleteMany({ recipientUser: userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    return {
      message: "Profile and all associated data deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw createError({
      statusCode: 500,
      message: "An error occurred while deleting the profile",
    });
  }
});
