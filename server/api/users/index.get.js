import { User } from "../../models/User.js";
import { TotalBooking } from "../../models/totalBooking.js";
import jwt from "jsonwebtoken";
import connectDB from "~~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // check if user is login/signup
  const authHeader = getHeader(event, "authorization");
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "No token found" });
  }
  // Bearer <token>
  const token = authHeader.split(" ")[1];

  //   only admins
  try {
    const user = jwt.verify(token, config.secretStr);
    if (user.role !== "admin") {
      throw createError({ statusCode: 401, statusMessage: "Access denied" });
    }

    await connectDB();
    // dont return password
    const users = await User.find().select("-password");

    // aggregate booking counts per user email
    const bookings = await TotalBooking.aggregate([
      { $match: { status: { $in: ["success", "confirmed"] } } },
      { $group: { _id: "$userEmail", count: { $sum: 1 } } },
    ]);
    const bookingMap = {};
    for (const b of bookings) bookingMap[b._id] = b.count;

    // attach events count to users
    const usersWithCounts = users.map((u) => {
      const obj = u.toObject();
      obj.events = bookingMap[u.email] || 0;
      return obj;
    });

    return { users: usersWithCounts };
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
});