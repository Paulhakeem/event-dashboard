import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { v2 as cloudinary } from "cloudinary";
import { setAuthCookie } from "../../utils/authCookie.js";

const GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";
const ALLOWED_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

async function verifyGoogleIdToken(credential, config) {
  if (
    !credential ||
    typeof credential !== "string" ||
    credential.length === 0 ||
    credential.length > 8192
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Google credential",
    });
  }

  let payload;
  try {
    payload = await $fetch(GOOGLE_TOKENINFO_URL, {
      method: "POST",
      params: { id_token: credential },
      timeout: 15000,
    });
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Google token could not be verified",
    });
  }

  if (!payload || typeof payload !== "object") {
    throw createError({
      statusCode: 401,
      statusMessage: "Google token could not be verified",
    });
  }

  if (config.googleClientId && payload.aud !== config.googleClientId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Google token audience mismatch",
    });
  }

  if (!ALLOWED_ISSUERS.includes(payload.iss)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid Google token issuer",
    });
  }

  const emailVerified =
    payload.email_verified === true || payload.email_verified === "true";
  if (!emailVerified || !payload.email || !payload.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: "Google account email is not verified",
    });
  }

  if (payload.exp && Number(payload.exp) * 1000 < Date.now()) {
    throw createError({
      statusCode: 401,
      statusMessage: "Google token has expired",
    });
  }

  return {
    email: String(payload.email).toLowerCase(),
    googleId: String(payload.sub),
    name: typeof payload.name === "string" ? payload.name : "",
    picture: typeof payload.picture === "string" ? payload.picture : "",
  };
}

export default defineEventHandler(async (event) => {
  await connectDB();

  // Cloudinary config (kept for future image uploads)
  const config = useRuntimeConfig();

  try {
    const { credential } = await readBody(event);

    if (!credential) {
      throw createError({
        statusCode: 400,
        statusMessage: "Google credential is required",
      });
    }

    // Verify the ID token server-side — never trust client-supplied claims
    const googleUser = await verifyGoogleIdToken(credential, config);
    const { email, googleId } = googleUser;

    // robust name parsing
    const nameParts = (googleUser.name || "").trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || "user";
    const lastName = nameParts.slice(1).join(" ") || "";
    const picture = googleUser.picture;

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
      } else if (user.googleId !== googleId) {
        // The stored googleId does not match the verified token sub
        throw createError({
          statusCode: 409,
          statusMessage: "Google account already linked to another user",
        });
      }
    } else {
      // New user via Google — create account (omit password field)
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
      { algorithm: "HS256", expiresIn: "1d" },
    );

    setAuthCookie(event, token, config);

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