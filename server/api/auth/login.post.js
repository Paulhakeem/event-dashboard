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
  const config = useRuntimeConfig();
  
  if (!config.SecretStr) {
    throw createError({
      statusCode: 500,
      statusMessage: "JWT secret is not configured",
    });
  }
  // generate a JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    config.secretStr,
    { expiresIn: "1d" }
  );

  return { token, user };
});
