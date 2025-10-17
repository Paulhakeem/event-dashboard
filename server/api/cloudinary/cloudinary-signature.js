import crypto from "crypto";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
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
    };
});