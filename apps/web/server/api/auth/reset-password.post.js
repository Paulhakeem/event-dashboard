import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const { email, code, newPassword } = await readBody(event);

  if (typeof email !== "string" || !email.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or expired reset code",
    });
  }
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or expired reset code",
    });
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 8 characters long",
    });
  }

  await connectDB();

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
    resetCode: code,
    resetCodeExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or expired reset code",
    });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;

  await user.save();

  return {
    message: "Password reset successful",
  };
});