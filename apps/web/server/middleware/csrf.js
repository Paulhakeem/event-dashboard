import { getHeader, getRequestHost } from "h3";

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function sourceHost(value) {
  if (!value || typeof value !== "string") return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

export default defineEventHandler((event) => {
  const method = (event.node.req.method || "GET").toUpperCase();
  if (!STATE_CHANGING_METHODS.has(method)) return;

  // Non-browser clients (M-Pesa callbacks, server-to-server, CLI tools)
  // typically omit Origin/Referer entirely — allow those.
  const origin = getHeader(event, "origin");
  const referer = getHeader(event, "referer");
  const source = origin || referer;
  if (!source) return;

  const sourceHostname = sourceHost(source);
  const requestHost = (getRequestHost(event) || "").toLowerCase();
  if (!sourceHostname || !requestHost) return;

  if (sourceHostname === requestHost) return;

  const config = useRuntimeConfig();
  const appUrlHost = config.appUrl ? sourceHost(config.appUrl) : null;
  if (appUrlHost && appUrlHost === sourceHostname) return;

  throw createError({
    statusCode: 403,
    statusMessage: "Cross-site request blocked",
  });
});