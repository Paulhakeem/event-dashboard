import { Event } from "../models/Events.js";

// Update any events whose date has passed and are not yet marked as completed.
// This can be called from request handlers or a scheduled job.
export async function markPastEventsCompleted() {
  try {
    const now = new Date();
    await Event.updateMany(
      { date: { $lt: now }, status: { $ne: "completed" } },
      { $set: { status: "completed" } }
    );
  } catch (err) {
    console.error("Error updating past event statuses:", err);
  }
}
