import jwt from "jsonwebtoken";
import { getAuthToken } from "../../utils/authCookie.js";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

// Rebuilds the client auth state from the httpOnly auth_token cookie on every
// page load. The JWT itself only carries { id, email, role }, so we load the
// rest of the profile (name, photo, joined date) from the database.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getAuthToken(event);

  if (!token) return { token: null, user: null };

  try {
    const decoded = jwt.verify(token, config.secretStr, {
      algorithms: ["HS256"],
    });

    await connectDB();

    const user = await User.findById(decoded.id)
      .select("firstName lastName email profileImage role joinedAt accountStatus isEmailVerified")
      .lean();

    if (
      !user ||
      user.accountStatus === "suspended" ||
      !user.isEmailVerified
    ) {
      return { token: null, user: null };
    }

    return {
      token,
      user: {
        id: String(user._id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        joinedAt: user.joinedAt,
      },
    };
  } catch {
    return { token: null, user: null };
  }
});