import mongoose from "mongoose";
const totalBookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      default: 0,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
export const TotalBooking =
  mongoose.models.TotalBooking ||
  mongoose.model("TotalBooking", totalBookingSchema);
