import connectDB from "../../utils/mongoose.js";
import { User } from "../../models/User.js";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import jwt from "jsonwebtoken";

function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  await connectDB();

  // Cloudinary config
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  // Auth
  const authHeader = event.node.req.headers.authorization;
  if (!authHeader) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token, config.secretStr);

  const user = await User.findById(decoded.id);
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" });

  // Parse multipart form
  const form = formidable({ multiples: false, keepExtensions: true });
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const imageFile = files.profileImage || files.profileimage || files.image;
  if (!imageFile) {
    throw createError({ statusCode: 400, statusMessage: "No image provided" });
  }

  // upload to Cloudinary
  if (imageFile.size > 10 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: "Image too large" });
  }

  const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
    folder: "profiles",
    use_filename: true,
    unique_filename: true,
  });

  // remove temp file
  fs.unlink(imageFile.filepath, () => {});

  user.profileImage = uploadResult.secure_url;
  await user.save();

  return {
    message: "Profile image updated",
    user: {
      id: user._id,
      profileImage: user.profileImage,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      adminNumber: user.adminNumber,
      role: user.role,
      joinedAt: user.joinedAt,
    },
  };
});
