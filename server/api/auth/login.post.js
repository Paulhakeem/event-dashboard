import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  await connectDB();

  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  // normalize email
  const normalizedEmail = email.toLowerCase();

  // Find user
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }

  // ✅ Correct verification check
  if (!user.isEmailVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: "Please verify your email before logging in",
    });
  }

  // Password check
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }

  // JWT
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.secretStr,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      joinedAt: user.joinedAt,
    },
  };
});
