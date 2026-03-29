import { User } from "~~/server/models/User.js";
import { requireAuth } from "~~/server/utils/requireAuth";
import connectDB from "~~/server/utils/mongoose.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  const user = await requireAuth(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const body = await readBody(event);
  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();

  if (!firstName) throw createError({ statusCode: 400, message: "First name is required" });
  if (!lastName) throw createError({ statusCode: 400, message: "Last name is required" });
  if (firstName.length < 2 || lastName.length < 2 || firstName.length > 50 || lastName.length > 50) {
    throw createError({
      statusCode: 400,
      message: "First and last name must be 2..50 chars",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { firstName, lastName },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updatedUser) throw createError({ statusCode: 404, message: "User not found" });

    return { message: "Profile updated successfully", user: updatedUser };
  } catch (err) {
    console.error("Error updating profile:", err);
    throw createError({ statusCode: err.statusCode || 500, message: err.message || "Unable to update profile" });
  }
});