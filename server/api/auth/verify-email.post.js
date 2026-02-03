import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event);
  const { email, code } = body;

  /* ---------- VALIDATION ---------- */
  if (!email || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and verification code are required",
    });
  }

  /* ---------- FIND USER ---------- */
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  if (user.isEmailVerified) {
    return {
      message: "Email already verified",
    };
  }

  /* ---------- CHECK CODE ---------- */
  if (
    user.emailVerificationCode !== code ||
    user.emailVerificationExpires < Date.now()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or expired verification code",
    });
  }

  /* ---------- VERIFY USER ---------- */
  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return {
    message: "Email verified successfully. You can now login.",
  };
});
