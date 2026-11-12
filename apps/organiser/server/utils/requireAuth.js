import jwt from "jsonwebtoken";
import { createError } from "h3";
import { getAuthToken } from "./authCookie.js";
import { User } from "../models/User.js";
import connectDB from "./mongoose.js";

export async function requireAuth(event) {
  const config = useRuntimeConfig();
  const token = getAuthToken(event);

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token missing",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.secretStr, {
      algorithms: ["HS256"],
    });
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }

  await connectDB();

  const user = await User.findById(decoded.id).select(
    "accountStatus isEmailVerified email",
  );
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Account no longer exists",
    });
  }
  if (user.accountStatus === "suspended") {
    throw createError({
      statusCode: 403,
      statusMessage: "This account has been suspended",
    });
  }
  if (!user.isEmailVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: "Please verify your email first",
    });
  }

  // Tokens issued before `email` was added to the payload will lack it here;
  // always fill it from the DB so callers can rely on authUser.email.
  event.context.user = { ...decoded, email: user.email };
  return event.context.user;
}

// Returns the authenticated user when a valid session exists, otherwise null.
// Booking endpoints use this so guests can book without an account while
// logged-in users keep their account-linked bookings.
export async function getOptionalAuth(event) {
  const config = useRuntimeConfig();
  const token = getAuthToken(event);

  if (!token) return null;

  let decoded;
  try {
    decoded = jwt.verify(token, config.secretStr, {
      algorithms: ["HS256"],
    });
  } catch {
    return null;
  }

  await connectDB();

  const user = await User.findById(decoded.id).select(
    "accountStatus isEmailVerified email",
  );
  if (!user) return null;

  if (user.accountStatus === "suspended") {
    throw createError({
      statusCode: 403,
      statusMessage: "This account has been suspended",
    });
  }

  if (!user.isEmailVerified) return null;

  event.context.user = { ...decoded, email: user.email };
  return event.context.user;
}
