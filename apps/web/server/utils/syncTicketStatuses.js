import { Event } from "../models/Events.js";
import { Ticket } from "../models/Ticket.js";

export async function syncTicketStatuses() {
  const now = new Date();
  const expiredEventIds = await Event.distinct("_id", {
    date: { $lt: now },
  });

  await Ticket.updateMany(
    {
      status: "active",
      $or: [{ used: true }, { eventId: { $in: expiredEventIds } }],
    },
    { $set: { status: "inactive" } },
  );
}
