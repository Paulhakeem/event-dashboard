import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  await connectDB();

  // find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }
  // compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }
  // generate a JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return (
    { message: "Login successful", token, user },
    "jwt_secret",
    { expiresIn: "1d" }
  );
});
