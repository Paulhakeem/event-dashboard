import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { v2 as cloudinary } from "cloudinary";

export default defineEventHandler(async (event) => {
  await connectDB();

  //   Cloudinary config
  const config = useRuntimeConfig();
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  const { name, email, picture, googleId } = readBody(event);

  if (!email || !googleId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Google credentials",
    });
  }

  //   split name into first and last name
  const [firstName, ...lastNameParts] = (name || "user").split(" ");
  const lastName = lastNameParts.join(" ") || " ";

  let user = await User.findOne({ email });

  if (user) {
    // If registered via email/password before, link Google to their account
    if (!user.googleId) {
      user.googleId = googleId;
      user.isEmailVerified = true; // Google already verified their email
      if (!user.profileImage && picture) user.profileImage = picture;
      await user.save();
    }
  } else {
    // New user via Google — create account (no password, already verified)
    user = await User.create({
      firstName,
      lastName,
      email,
      googleId,
      isEmailVerified: true,
      role: "user",
      password: null, // No password for Google accounts
      profileImage: picture || null,
    });
  }

  //   Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.secretStr,
    { expiresIn: "1d" }
  );
  return {
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
    },
  };
});
