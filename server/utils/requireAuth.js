import jwt from "jsonwebtoken";
import { createError } from "h3";
import { getAuthToken } from "./authCookie.js";

export function requireAuth(event) {
  const config = useRuntimeConfig();
  const token = getAuthToken(event);

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, config.secretStr);
    event.context.user = decoded;
    return decoded;
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }
}
