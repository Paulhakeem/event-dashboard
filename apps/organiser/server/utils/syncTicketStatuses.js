import { Event, getEventStartEnd } from "../models/Events.js";
import { Ticket } from "../models/Ticket.js";

export async function syncTicketStatuses() {
  const now = new Date();
  const events = await Event.find(
    {},
    { date: 1, startDate: 1, endDate: 1, startTime: 1, endTime: 1 },
  ).lean();

  const expiredEventIds = events
    .filter((item) => {
      const window = getEventStartEnd(item);
      return window && window.end < now;
    })
    .map((item) => item._id);

  await Ticket.updateMany(
    {
      status: "active",
      $or: [{ used: true }, { eventId: { $in: expiredEventIds } }],
    },
    { $set: { status: "inactive" } },
  );
}
