import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import jwt from "jsonwebtoken";
import { requireAuth } from "../../utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  await connectDB();

  if (event.context.user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied",
    });
  }

  const body = await readBody(event);

  const { firstName, lastName, email, password } = body;

  if (!firstName || !lastName || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    throw createError({
      statusCode: 400,
      statusMessage: "Admin with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "admin",
  });
  await newAdmin.save();
  return { message: "Admin created successfully" };
});
