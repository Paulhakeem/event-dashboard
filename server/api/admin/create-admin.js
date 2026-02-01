import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { requireAuth } from "../../utils/requireAuth.js";
import { createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  // 🔐 Require authenticated user
  await requireAuth(event);

  await connectDB();

  const authUser = event.context.user;

  // 🔒 Only admins can create other admins
  if (!authUser || authUser.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied. Admins only.",
    });
  }

  // 📦 Read request body
  const { firstName, lastName, email, password } = await readBody(event);

  // ✅ Validate input
  if (![firstName, lastName, email, password].every(Boolean)) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  // 🚫 Prevent duplicate admins
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "User with this email already exists",
    });
  }

  // 🔐 Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 👤 Create admin
  const admin = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "admin",
  });

  return {
    success: true,
    message: "Admin created successfully",
    admin: {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    },
  };
});
