import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String },
  regular: { type: Number, default: 0 },
  vip: { type: Number, default: 0 },
  vvip: { type: Number, default: 0 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
