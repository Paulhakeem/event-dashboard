import { Event, syncEventStatuses } from "../models/Events.js";

export async function updateEventStatuses() {
  try {
    await syncEventStatuses(Event);
  } catch (err) {
    console.error("Error updating event statuses:", err);
  }
}

// Legacy function for backwards compatibility
export async function markPastEventsCompleted() {
  await updateEventStatuses();
}
