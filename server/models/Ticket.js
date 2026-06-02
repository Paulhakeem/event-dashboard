import mongoose from "mongoose";
const TicketSchema = new mongoose.Schema(
  {
    ticketCode: { type: String, required: true, unique: true },
    eventName: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userEmail: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TotalBooking",
      required: true,
    },
    ticketType: { type: String, required: true },
    amount: { type: Number, required: true },
    used: { type: Boolean, default: false },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
export const Ticket =
  mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
