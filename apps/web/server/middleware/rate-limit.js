import { getRequestIP, setResponseHeader } from "h3";

const WINDOW_MS = 60_000;

const RULES = [
  { path: "/api/auth/login", limit: 5 },
  { path: "/api/auth/regester", limit: 3 },
  { path: "/api/auth/forgot-password", limit: 5 },
  { path: "/api/auth/resend-code", limit: 3 },
  { path: "/api/auth/verify-email", limit: 10 },
  { path: "/api/auth/reset-password", limit: 5 },
  { path: "/api/auth/google", limit: 10 },
  { path: "/api/profile/mfa", limit: 30 },
  { path: "/api/chat", limit: 20 },
  { path: "/api/cloudinary", limit: 30 },
  { path: "/api/upload", limit: 10 },
  { path: "/api/organiser/addevent", limit: 10 },
  { path: "/api/booking/stkpush", limit: 10 },
  { path: "/api/booking/mpesa-callback", limit: 600 },
  { path: "/api/subscribe/mail", limit: 5 },
];

const DEFAULT_LIMIT = 300;

// in-memory buckets keyed by `${ip}:${path}` (single-instance PM2 / cluster:1)
const buckets = new Map();

export default defineEventHandler((event) => {
  const rawPath = event.path || event.node.req.url || "";
  const path = rawPath.split("?")[0];

  if (!path.startsWith("/api/")) return;

  const rule = RULES.find((r) => path.startsWith(r.path));
  const limit = rule?.limit || DEFAULT_LIMIT;
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";

  const key = `${ip}:${rule ? rule.path : "api-default"}`;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    setResponseHeader(
      event,
      "Retry-After",
      String(Math.ceil((bucket.resetAt - now) / 1000)),
    );
    throw createError({
      statusCode: 429,
      statusMessage: "Too many requests. Please try again later.",
    });
  }

  if (buckets.size > 100_000) {
    const expired = [];
    for (const [k, b] of buckets) if (b.resetAt < now) expired.push(k);
    for (const k of expired) buckets.delete(k);
  }
});