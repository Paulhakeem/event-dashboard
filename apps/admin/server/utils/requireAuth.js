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
    "accountStatus isEmailVerified",
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

  event.context.user = decoded;
  return decoded;
}