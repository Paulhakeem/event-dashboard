import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth.js";
import { verifyTotp } from "~~/server/utils/mfa.js";
import { logSecurity } from "~~/server/utils/logSecurity.js";

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event);
  const body = await readBody(event);
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!/^\d{6}$/.test(code)) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid 6-digit code is required",
    });
  }

  const user = await User.findById(authUser.id).select("+mfaSecret");
  if (!user || !user.mfaEnabled) {
    throw createError({
      statusCode: 400,
      statusMessage: "Two-factor authentication is not enabled",
    });
  }
  if (!verifyTotp(user.mfaSecret, code)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid authentication code",
    });
  }

  user.mfaEnabled = false;
  user.mfaSecret = undefined;
  await user.save();

  await logSecurity(event, "mfa_disabled", { userId: user._id, email: user.email });
  return { success: true, message: "Two-factor authentication disabled" };
});