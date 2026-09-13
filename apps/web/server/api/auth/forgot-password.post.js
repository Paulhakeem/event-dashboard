import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { sendResetEmail } from "~~/server/utils/mailer.js";
import { verifyRecaptcha } from "../../utils/verifyRecaptcha.js";
import { logSecurity } from "../../utils/logSecurity.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { email, recaptchaToken } = await readBody(event);

  await connectDB();

  // reCAPTCHA verification
  const recaptchaResult = await verifyRecaptcha(recaptchaToken, config);
  if (!recaptchaResult?.success && !recaptchaResult?.skipped) {
    throw createError({
      statusCode: 400,
      statusMessage:
        recaptchaResult?.message || "reCAPTCHA verification failed",
    });
  }

  if (typeof email !== "string" || !email.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid email is required",
    });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    // Generic response to avoid account enumeration
    return {
      message: "If an account exists for this email, a reset code has been sent.",
    };
  }

  // Generate 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetCode = resetCode;
  user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Send email here (nodemailer) — don't crash if mail fails
  await sendResetEmail(email, resetCode);

  await logSecurity(event, "password_reset_requested", {
    email: user.email,
    userId: user._id,
  });

  return {
    message: "Password reset code sent to your email",
  };
});