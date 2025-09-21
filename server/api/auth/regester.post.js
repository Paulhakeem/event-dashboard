import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password, role } = body;

  await connectDB();

  // prevent multiple admin accounts
  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin account already exists",
      });
    }
  }
  // check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists",
    });
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, role });

  return {
    message: "User registered successfully",
    user: await newUser.save(),
  };
});
