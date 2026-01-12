import mongoose from 'mongoose';
const TicketSchema = new mongoose.Schema({
 ticketCode: { type: String, required: true, unique: true },
 eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: true },
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'TotalBooking', required: true },
 ticketType: { type: String, required: true },
 amount: { type: Number, required: true },
 used: { type: Boolean, default: false },
 createdAt: { type: Date, default: Date.now },
});
export const Ticket = mongoose.model('Ticket', TicketSchema);