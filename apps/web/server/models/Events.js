import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  freeEntry: { type: Boolean, default: false },
  date: { type: Date, required: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  startTime: { type: String, default: "" },
  endTime: { type: String, default: "" },
  location: { type: String, required: true },
  TicketQuantity: { type: Number, default: 0 },
  maxTicketsPerUser: { type: Number, default: null },
  customTickets: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 0 },
      availableQuantity: { type: Number, default: 0 },
    },
  ],
  status: {
    type: String,
    enum: [
      "upcoming",
      "ongoing",
      "completed",
      "cancelled",
      "pending",
      "live",
      "inactive",
      "archived",
    ],
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
  shareUrl: { type: String },
});

const parseTime = (value, fallbackHour, fallbackMinute) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value || ""));
  if (!match) return [fallbackHour, fallbackMinute];
  return [Number(match[1]), Number(match[2])];
};

export function getEventStartEnd(item = {}) {
  const startSource = item.startDate || item.date;
  const endSource = item.endDate || item.startDate || item.date;
  if (!startSource || !endSource) return null;

  const start = new Date(startSource);
  const end = new Date(endSource);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const [startHour, startMinute] = parseTime(item.startTime, 0, 0);
  const [endHour, endMinute] = parseTime(item.endTime, 23, 59);
  start.setHours(startHour, startMinute, 0, 0);
  end.setHours(endHour, endMinute, 59, 999);

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return { start, end };
}

export async function syncEventStatuses(model, now = new Date()) {
  const events = await model.aggregate([
    {
      $match: {
        status: {
          $nin: ["pending", "completed", "cancelled", "inactive", "archived"],
        },
      },
    },
    {
      $project: {
        status: 1,
        date: 1,
        startDate: 1,
        endDate: 1,
        startTime: 1,
        endTime: 1,
      },
    },
  ]);

  const operations = [];
  for (const item of events) {
    const window = getEventStartEnd(item);
    if (!window) continue;
    const { start, end } = window;

    let status;
    if (now < start) status = "upcoming";
    else if (now > end) status = "completed";
    else status = "live";

    if (status !== item.status) {
      operations.push({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { status } },
        },
      });
    }
  }

  if (operations.length) await model.bulkWrite(operations);
}

// whenever events are queried, ensure statuses are updated based on dates
eventSchema.pre(/^find/, async function (next) {
  try {
    await syncEventStatuses(this.model);
  } catch (err) {
    console.error("Error auto-updating event statuses:", err);
  }
  next();
});

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
