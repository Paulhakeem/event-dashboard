import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { sendResetEmail } from "~~/server/utils/mailer.js";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "User not found",
    });
  }

  // Generate 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetCode = resetCode;
  user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Send email here (nodemailer) — don't crash if mail fails
  const sendResult = await sendResetEmail(email, resetCode);

  const message = sendResult?.ok
    ? "Password reset code sent to your email"
    : "Password reset code generated. Email sending failed or SMTP not configured.";

  return {
    message,
    _mail: sendResult?.message || null,
  };
});
