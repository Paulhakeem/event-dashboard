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
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
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
    verifiedAt: {
      type: Date,
    },
    refundStatus: {
      type: String,
      enum: ["not_requested", "pending", "processing", "completed", "failed"],
      default: "not_requested",
    },
    refundAmount: { type: Number, default: 0 },
    refundReason: String,
    refundReference: String,
    refundProcessedAt: Date,
    disputeStatus: {
      type: String,
      enum: ["none", "open", "investigating", "resolved", "rejected"],
      default: "none",
    },
    disputeReason: String,
    disputeNote: String,
    disputedAt: Date,
    reconciled: { type: Boolean, default: false },
    reconciledAt: Date,
    reconciliationNote: String,
    lastActionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
export const TotalBooking =
  mongoose.models.TotalBooking ||
  mongoose.model("TotalBooking", totalBookingSchema);
