import jwt from "jsonwebtoken";
import { createError } from "h3";
export function requireAuth(event) {
  const config = useRuntimeConfig();
  const authHeader = event.node.req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.secretStr);
    event.context.user = decoded
    return decoded; // return user payload
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }
}
