import mongoose from "mongoose";

const securityEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    email: { type: String },
    role: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ip: { type: String },
    userAgent: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, expires: 2592000 },
  },
  { timestamps: true, collection: "securityevents" },
);

export const SecurityEvent =
  mongoose.models.SecurityEvent ||
  mongoose.model("SecurityEvent", securityEventSchema);