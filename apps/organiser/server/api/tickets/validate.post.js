import mongoose from "mongoose";
import connectDB from "~~/server/utils/mongoose.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { Event, getEventStartEnd } from "~~/server/models/Events.js";
import { Ticket } from "~~/server/models/Ticket.js";

const extractTicketCode = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";
  const match = /TKT-[A-Z0-9]+/i.exec(text);
  return match ? match[0].toUpperCase() : text;
};

export default defineEventHandler(async (event) => {
  await connectDB();
  const scanner = await requireAuth(event);

  if (scanner.role !== "organiser") {
    throw createError({
      statusCode: 403,
      statusMessage: "Organiser access required",
    });
  }

  const body = await readBody(event);
  const ticketCode = extractTicketCode(body?.ticketCode);
  const eventId = body?.eventId;
  if (!ticketCode) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket code is required",
    });
  }
  if (!mongoose.isValidObjectId(eventId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid event id" });
  }

  const ticketEvent = await Event.findOne({
    _id: eventId,
    createdBy: scanner.id,
  })
    .select("title date startDate endDate startTime endTime")
    .lean();
  if (!ticketEvent) {
    throw createError({
      statusCode: 403,
      statusMessage: "You can only scan tickets for your own events.",
    });
  }

  const existingTicket = await Ticket.findOne({
    ticketCode,
    eventId: ticketEvent._id,
  });
  if (!existingTicket) {
    throw createError({ statusCode: 404, statusMessage: "Invalid ticket" });
  }
  const ticketQuantity = Math.max(1, Number(existingTicket.quantity) || 1);
  const usedQuantity = Number(existingTicket.usedQuantity) || 0;

  if (
    existingTicket.used ||
    usedQuantity >= ticketQuantity ||
    existingTicket.status !== "active"
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: existingTicket.used || usedQuantity >= ticketQuantity
        ? "Ticket already used; ticket is inactive"
        : "Ticket is not active",
    });
  }

  const eventWindow = getEventStartEnd(ticketEvent);
  if (!eventWindow || eventWindow.end < new Date()) {
    await Ticket.updateOne(
      { _id: existingTicket._id, status: "active" },
      { $set: { status: "inactive" } },
    );
    throw createError({
      statusCode: 400,
      statusMessage: "Event has expired; ticket is inactive",
    });
  }

  const ticket = await Ticket.findOneAndUpdate(
    {
      _id: existingTicket._id,
      eventId: ticketEvent._id,
      used: false,
      status: "active",
      $expr: {
        $lt: [
          { $ifNull: ["$usedQuantity", 0] },
          { $ifNull: ["$quantity", 1] },
        ],
      },
    },
    [
      {
        $set: {
          usedQuantity: { $add: [{ $ifNull: ["$usedQuantity", 0] }, 1] },
          usedAt: new Date(),
        },
      },
      {
        $set: {
          used: {
            $gte: ["$usedQuantity", { $ifNull: ["$quantity", 1] }],
          },
          status: {
            $cond: [
              { $gte: ["$usedQuantity", { $ifNull: ["$quantity", 1] }] },
              "inactive",
              "active",
            ],
          },
        },
      },
    ],
    { new: true },
  ).populate("userId", "firstName lastName");

  if (!ticket) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket already used; ticket is inactive",
    });
  }

  return {
    message: "Ticket valid. Entry allowed.",
    ticket: {
      ticketCode: ticket.ticketCode,
      userName:
        `${ticket.userId?.firstName || ticket.firstName || ""} ${ticket.userId?.lastName || ticket.lastName || ""}`.trim() ||
        ticket.userEmail,
      eventName: ticket.eventName || ticketEvent.title,
      ticketType: ticket.ticketType,
      quantity: ticket.quantity || 1,
      usedQuantity: ticket.usedQuantity || 0,
      entriesRemaining: (ticket.quantity || 1) - (ticket.usedQuantity || 0),
      usedAt: ticket.usedAt,
    },
  };
});
