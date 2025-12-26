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
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    reference: {
      type: String,
      required: true,
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
    ticketType: {
      type: String,
      enum: ["regular", "vip", "vvip"],
      required: true,
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
