import mongoose from "mongoose";

const pendingPaymentSchema = new mongoose.Schema(
  {
    CheckoutRequestID: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: { type: String, required: true },
    phone: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: { type: String, required: true },
    ticketType: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "claimed", "failed", "mismatch"],
      default: "pending",
    },
    callbackAmount: { type: Number },
    mpesaReceiptNumber: { type: String },
    transactionId: { type: String },
    verifiedAt: { type: Date },
    claimedAt: { type: Date },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

pendingPaymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingPayment =
  mongoose.models.PendingPayment ||
  mongoose.model("PendingPayment", pendingPaymentSchema);