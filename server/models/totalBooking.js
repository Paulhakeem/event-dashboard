import mongoose from "mongoose";
const totalBookingSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    // user who made the booking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // organiser (event creator) - stored for easy querying
    organiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    mpesaReceiptNumber: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  { timestamps: true }
);
export const TotalBooking =
  mongoose.models.TotalBooking ||
  mongoose.model("TotalBooking", totalBookingSchema);
