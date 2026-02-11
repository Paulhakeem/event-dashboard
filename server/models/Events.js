import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  TicketQuantity: { type: Number, required: true, default: 0 },
  regular: { type: Number, default: 0 },
  vip: { type: Number, default: 0 },
  vvip: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled", "pending"],
    default: "upcoming",
  },
  eventType: {
    type: String,
    enum: ["Entertainment", "Arts & Culture", "Tech & Business", "other"],
    default: "other",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
