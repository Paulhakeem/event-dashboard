import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { v2 as cloudinary } from "cloudinary";

export default defineEventHandler(async (event) => {
  await connectDB();

  // Cloudinary config (kept for future image uploads)
  const config = useRuntimeConfig();
  if (
    config.cloudinaryCloudName &&
    config.cloudinaryApiKey &&
    config.cloudinaryApiSecret
  ) {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
    });
  }

  try {
    const { name, email, picture, googleId } = await readBody(event);

    if (!email || !googleId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid Google credentials",
      });
    }

    // robust name parsing
    const nameParts = (name || "").trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || "user";
    const lastName = nameParts.slice(1).join(" ") || "";

    // ensure JWT secret exists
    if (!config.secretStr) {
      throw createError({
        statusCode: 500,
        statusMessage: "Server misconfiguration: missing JWT secret",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      // If registered via email/password before, link Google to their account
      if (!user.googleId) {
        // ensure googleId isn't already linked to another account
        const existingGoogleUser = await User.findOne({ googleId });
        if (
          existingGoogleUser &&
          existingGoogleUser._id.toString() !== user._id.toString()
        ) {
          throw createError({
            statusCode: 409,
            statusMessage: "Google account already linked to another user",
          });
        }

        user.googleId = googleId;
        user.isEmailVerified = true; // Google already verified their email
        if (!user.profileImage && picture) user.profileImage = picture;
        await user.save();
      }
    } else {
      // New user via Google — create account (omit password field)
      // ensure googleId isn't already used
      const existingGoogleUser = await User.findOne({ googleId });
      if (existingGoogleUser) {
        // Rare: googleId exists but email not found — conflict
        throw createError({
          statusCode: 409,
          statusMessage: "Google account already registered",
        });
      }

      user = await User.create({
        firstName,
        lastName,
        email,
        googleId,
        isEmailVerified: true,
        role: "user",
        profileImage: picture || null,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.secretStr,
      { expiresIn: "1d" },
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
  } catch (err) {
    // Handle Mongo duplicate key errors gracefully
    if (err && err.name === "MongoServerError" && err.code === 11000) {
      throw createError({
        statusCode: 409,
        statusMessage: "Duplicate key error",
      });
    }
    // Re-throw Nitro createError or wrap other errors
    if (err && err.statusCode) throw err;
    // unexpected
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Internal Server Error",
    });
  }
});
