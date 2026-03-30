import mongoose from "mongoose";

const CancelledTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  amount: { type: Number, required: true },
  cancelledAt: { type: Date, default: Date.now },
});

export const CancelledTicket = mongoose.model(
  "CancelledTicket",
  CancelledTicketSchema,
);
