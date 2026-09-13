import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { setAuthCookie } from "../../utils/authCookie.js";
import { verifyRecaptcha } from "../../utils/verifyRecaptcha.js";
import { verifyTotp } from "../../utils/mfa.js";
import { logSecurity } from "../../utils/logSecurity.js";

// Constant-time dummy hash so unknown accounts take similar time to compare.
const DUMMY_PASSWORD_HASH =
  "$2b$10$7wwfFlRSDdKO0os0yLq01uZ8ArnunsL1/.kMdt3wyj.UiX.0xRw9u";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  await connectDB();

  const { email, password, recaptchaToken, mfaCode } = await readBody(event);

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  // reCAPTCHA verification
  const recaptchaResult = await verifyRecaptcha(recaptchaToken, config);
  if (!recaptchaResult?.success && !recaptchaResult?.skipped) {
    throw createError({
      statusCode: 400,
      statusMessage:
        recaptchaResult?.message || "reCAPTCHA verification failed",
    });
  }

  // normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Find user
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password +mfaSecret isEmailVerified accountStatus role firstName lastName profileImage joinedAt",
  );

  // Unknown account or Google-only account → generic message, constant-ish time
  if (!user || !user.password) {
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }

  // Password check
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    await logSecurity(event, "login_failed", {
      email: user.email,
      role: user.role,
      userId: user._id,
      reason: "invalid_password",
    });
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }

  if (!user.isEmailVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: "Please verify your email before logging in",
    });
  }

  if (user.accountStatus === "suspended") {
    throw createError({
      statusCode: 403,
      statusMessage: "This account has been suspended",
    });
  }

  // Two-factor authentication
  if (user.mfaEnabled) {
    const validCode =
      typeof mfaCode === "string" && verifyTotp(user.mfaSecret, mfaCode);
    if (!validCode) {
      await logSecurity(event, "login_failed", {
        email: user.email,
        role: user.role,
        userId: user._id,
        reason: "invalid_mfa",
      });
      throw createError({
        statusCode: 403,
        statusMessage: "Two-factor authentication is required for this account",
      });
    }
  }

  // JWT
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.secretStr,
    { algorithm: "HS256", expiresIn: "1d" },
  );

  setAuthCookie(event, token, config);

  await logSecurity(event, "login_success", {
    email: user.email,
    role: user.role,
    userId: user._id,
  });

  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      joinedAt: user.joinedAt,
    },
  };
});