import jwt from "jsonwebtoken";

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
    return decoded; // return user payload
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }
}
