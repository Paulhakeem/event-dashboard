import nodemailer from "nodemailer";
import connectDB from "../../utils/mongoose";
import { User } from "../../models/User";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  await connectDB();

  const { email } = await readBody(event);

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

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.emailVerificationCode = code;
  user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000)
  await user.save();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailUsername,
      pass: config.emailPass,
    },
  });

  await transporter.sendMail({
    from: `"Event Dashboard" <${config.emailUsername}>`,
    to: email,
    subject: "Resend verification code",
    html: `<h2>Your new verification code</h2><h1>${code}</h1>`,
  });

  return {
    success: true,
    message: "New verification code sent",
  };
});
