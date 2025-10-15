import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
// Helper to verify token
function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: "Invalid Token" });
  }
}

export default defineEventHandler(async (event) => {
  await connectDB();
  const config = useRuntimeConfig();

  // Configure Cloudinary

  cloudinary.config({
    cloud_name: config.public.cloudinaryCloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  // Get user from token stored in headers
  const authHeader = event.node.req.headers.authorization;
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token, config.secretStr);

  const user = await User.findById(decoded.id);
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Access Denied" });
  }
  const body = await readBody(event);
  const { title, description, date, location, image, price } = body;

  if (!title || !description || !date || !location || !image || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  // Upload image to Cloudinary
  const upload = await cloudinary.uploader.upload(image, {
    folder: "event-dashboard",
  });

  const newEvent = new Event({
    title,
    description,
    date: new Date(date),
    location,
    image: upload.secure_url,
    price,
  });
  await newEvent.save();

  return { message: "Event created successfully", event: newEvent };
});
