import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { generateTotpSecret, buildOtpauth } from "~~/server/utils/mfa.js";
import QRCode from "qrcode";

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event);
  const user = await User.findById(authUser.id);
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  if (user.mfaEnabled) {
    throw createError({
      statusCode: 400,
      statusMessage: "Two-factor authentication is already enabled",
    });
  }

  const secret = generateTotpSecret();
  user.mfaSecret = secret;
  user.mfaEnabled = false;
  await user.save();

  const otpauth = buildOtpauth(secret, user.email);
  const qrDataUrl = await QRCode.toDataURL(otpauth);

  return {
    success: true,
    secret,
    otpauth,
    qrDataUrl,
  };
});