import crypto from "crypto";
import { requireAuth } from "../../utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const user = await requireAuth(event);
  if (user.role !== "admin" && user.role !== "organiser") {
    throw createError({
      statusCode: 403,
      statusMessage: "Upload access requires an admin or organiser account",
    });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `timestamp=${timestamp}${config.cloudinaryApiSecret}`;

    // Generate SHA-1 hash
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");
    return {
      timestamp,
      signature,
      apiKey: config.cloudinaryApiKey,
      cloudName: config.cloudinaryCloudName,
    };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: "Server Error" });
  }
});