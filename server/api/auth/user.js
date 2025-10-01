import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";
import connectDB from "../../utils/mongoose.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  await connectDB();

  // get token from header
  const authHeader = getHeader(event, "authorization");
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "No token provided" });
  }

  //   bearer <token>
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "invalid token" });
  }

  try {
    // verify token
    const verifyToken = jwt.verify(token, config.secretStr);
    // fetch user from DB
    const getUser = await User.findById(verifyToken.id).select("password");

    if (!getUser) {
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    return getUser;
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid or expired token" });
  }
});
