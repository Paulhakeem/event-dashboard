import { Event } from "../models/Events.js";

// Update events based on their dates
// Mark today's events as "live" and past events as "completed"
export async function updateEventStatuses() {
  try {
    const now = new Date();
    
    // Get today's date range (start and end of day)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    // Mark today's events as live
    await Event.updateMany(
      {
        date: { $gte: todayStart, $lt: todayEnd },
        status: { $nin: ["completed", "cancelled"] }
      },
      { $set: { status: "live" } }
    );
    
    // Mark past events as completed
    await Event.updateMany(
      { date: { $lt: todayStart }, status: { $nin: ["completed", "cancelled"] } },
      { $set: { status: "completed" } }
    );
  } catch (err) {
    console.error("Error updating event statuses:", err);
  }
}

// Legacy function for backwards compatibility
export async function markPastEventsCompleted() {
  await updateEventStatuses();
}
