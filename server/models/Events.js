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

// whenever events are queried, ensure any past events are marked completed
eventSchema.pre(/^find/, async function(next) {
  try {
    const now = new Date();
    // this.model is already the Model instance for the current query
    await this.model.updateMany(
      { date: { $lt: now }, status: { $ne: "completed" } },
      { $set: { status: "completed" } }
    );
  } catch (err) {
    console.error("Error auto-updating event statuses:", err);
  }
  next();
});

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
