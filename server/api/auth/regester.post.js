import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { firstName, lastName, email, password, role } = body;

  await connectDB();

  // validation
  if (!firstName || !lastName || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }


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
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "name or email already taken",
    });
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  return {
    message: "User registered successfully",
  };
});
