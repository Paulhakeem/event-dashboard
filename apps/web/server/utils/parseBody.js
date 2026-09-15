import { readFormData, readMultipartFormData, readRawBody } from "h3";

// Robust body parser that survives proxies/intermediaries which strip or
// rewrite the Content-Type header, and handles every common encoding:
//   - application/json (with or without charset, BOM, double-encoded)
//   - no Content-Type at all (raw JSON)
//   - text/plain
//   - application/x-www-form-urlencoded
//   - multipart/form-data (files are reduced to their names)
export async function parseBody(event) {
  const ct = (event.node.req.headers["content-type"] || "").toLowerCase();

  try {
    if (ct.startsWith("application/x-www-form-urlencoded")) {
      const raw = ((await readRawBody(event, "utf8").catch(() => "")) || "").toString();
      return Object.fromEntries(new URLSearchParams(raw));
    }

    if (ct.startsWith("multipart/form-data")) {
      const fd = await readFormData(event).catch(() => null);
      if (fd && typeof fd.entries === "function") {
        const obj = {};
        for (const [key, value] of fd.entries()) {
          obj[key] =
            typeof value === "string" ? value : String(value?.name ?? value ?? "");
        }
        return obj;
      }

      const parts = (await readMultipartFormData(event).catch(() => [])) || [];
      const obj = {};
      for (const part of parts) {
        obj[part.name] =
          typeof part.data === "string" ? part.data : String(part.data ?? "");
      }
      return obj;
    }

    let raw = ((await readRawBody(event, "utf8").catch(() => "")) || "").toString();
    raw = raw.replace(/^\uFEFF/, "").trim();

    if (!raw) {
      console.log("[parseBody] empty body received, ct=%s", ct);
      return {};
    }

    try {
      return JSON.parse(raw);
    } catch {
      // Some proxies double-encode the payload as a JSON string of JSON.
      try {
        return JSON.parse(JSON.parse(raw));
      } catch (err) {
        console.log("[parseBody] unable to JSON.parse body (length=%d, start=%s)",
          raw.length, raw.slice(0, 120));
        return {};
      }
    }
  } catch {
    return {};
  }
}