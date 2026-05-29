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
  customTickets: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
  }],
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled", "pending", "live"],
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

// whenever events are queried, ensure statuses are updated based on dates
eventSchema.pre(/^find/, async function (next) {
  try {
    const now = new Date();

    // Get today's date range (start and end of day)
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    // Mark today's events as live
    await this.model.updateMany(
      {
        date: { $gte: todayStart, $lt: todayEnd },
        status: { $ne: "completed" },
      },
      { $set: { status: "live" } },
    );

    // Mark past events as completed
    await this.model.updateMany(
      { date: { $lt: todayStart }, status: { $ne: "completed" } },
      { $set: { status: "completed" } },
    );
  } catch (err) {
    console.error("Error auto-updating event statuses:", err);
  }
  next();
});

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
