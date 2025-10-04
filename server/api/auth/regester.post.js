import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { firstName, lastName, email, password, role } = body;

  await connectDB();
  const config = useRuntimeConfig();
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
  const existingUser = await User.findOne({ email });
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

  // create JWT token
  const token = jwt.sign(
    {
      id: newUser._id,
      fname: newUser.firstName,
      sname: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    },
    config.secretStr, // comes from .env
    { expiresIn: "1d" }
  );

  // return user + token
  return {
    message: "User registered successfully",
    token,
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.joinedAt,
    },
  };
});
