import { getHeader, getRequestIP } from "h3";
import connectDB from "./mongoose.js";
import { SecurityEvent } from "../models/SecurityEvent.js";

export async function logSecurity(event, eventName, details = {}) {
  try {
    await connectDB();
    await SecurityEvent.create({
      event: eventName,
      email: details.email,
      role: details.role,
      userId: details.userId,
      ip: getRequestIP(event, { xForwardedFor: true }) || null,
      userAgent: getHeader(event, "user-agent") || null,
      details,
    });
  } catch (err) {
    console.error("Failed to write security audit log:", err);
  }
}