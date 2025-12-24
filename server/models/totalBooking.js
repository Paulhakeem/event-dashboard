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
    eventName: {
      type: String,
      default: "",
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
    reference: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "success",
        "cancelled",
        "failed",
        "refunded",
        "confirmed",
      ],
      default: "pending",
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const TotalBooking =
  mongoose.models.TotalBooking ||
  mongoose.model("TotalBooking", totalBookingSchema);
