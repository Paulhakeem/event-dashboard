import { User } from "../../models/User.js";
import { Event } from "../../models/Events.js";
import connectDB from "../../utils/mongoose.js";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 🔐 Helper: Verify token
function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
}

export default defineEventHandler(async (event) => {
  await connectDB();
  const config = useRuntimeConfig();

  // 🧠 Configure Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  // 🔐 Verify user
  const authHeader = event.node.req.headers.authorization;
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token, config.secretStr);

  const user = await User.findById(decoded.id);
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Access denied" });
  }

  // 🧾 Parse form data (text + image)
  const form = formidable({ multiples: false });
  const [fields, files] = await form.parse(event.node.req);

  const title = String(fields.title?.[0] || "");
  const description = String(fields.description?.[0] || "");
  const location = String(fields.location?.[0] || "");
  const date = String(fields.date?.[0] || "");
  const price = Number(fields.price?.[0] || 0);

  if (!title || !description || !location || !date || !files.image?.[0]) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  // ☁️ Upload image to Cloudinary
  const imageFile = files.image[0];
  const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
    folder: "events",
    use_filename: true,
    unique_filename: true,
  });

  // 🧹 Remove temp file (optional but good practice)
  fs.unlink(imageFile.filepath, () => {});

  // 💾 Save event in MongoDB
  const newEvent = new Event({
    title,
    description,
    location,
    date: new Date(date),
    price,
    image: uploadResult.secure_url, // cloudinary URL
    createdBy: user._id,
  });

  await newEvent.save();

  return {
    message: "Event created successfully",
    event: newEvent,
  };
});
