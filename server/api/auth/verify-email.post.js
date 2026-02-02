import connectDB from "../../utils/mongoose";
import { User } from "../../models/User";

export default defineEventHandler(async (event) => {
  await connectDB();
  const { email, code } = await readBody(event);

  if (!email || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and code are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  if (user.isEmailVerified) {
    return { message: "Email already verified" };
  }

  if (
    user.emailVerificationCode !== code ||
    user.emailVerificationExpires < Date.now()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or expired verification code",
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return {
    success: true,
    message: "Email verified successfully",
  };
});
