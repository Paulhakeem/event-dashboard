import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const { email, code, newPassword } = await readBody(event);

  await connectDB();

  const user = await User.findOne({
    email,
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
