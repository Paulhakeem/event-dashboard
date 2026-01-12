import connectDB from "../../utils/mongoose.js";
import { User } from "../../models/User.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const admin = await User.findOne({ role: "admin" }).select("_id");

  return {
    exists: !!admin,
  };
});
