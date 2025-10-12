import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events.js";
import formidable from "formidable";
import jwt from "jsonwebtoken";

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

  // Get user from token stored in headers
  const authHeader = event.node.req.headers.authorization;
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const config = useRuntimeConfig();
  const decoded = verifyToken(token, config.secretStr);

  const user = await User.findById(decoded.id);
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Access Denied" });
  }

  // Parse form data (for image + fields)
  const form = formidable({
    multiples: false,
    uploadDir: "public/uploads",
    keepExtensions: true,
  });

  const [fields, files] = await form.parse(event.node.req);

  // Convert all form fields to strings (Formidable returns arrays)
  const title = String(
    Array.isArray(fields.title) ? fields.title[0] : fields.title || ""
  );
  const description = String(
    Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description || ""
  );
  const location = String(
    Array.isArray(fields.location) ? fields.location[0] : fields.location || ""
  );
  const date = String(
    Array.isArray(fields.date) ? fields.date[0] : fields.date || ""
  );
  const price = Number(
    Array.isArray(fields.price) ? fields.price[0] : fields.price || 0
  );

  const imagePath =
    files.image?.[0].filepath?.replace(/\\/g, "/")?.split("public/")[1] || "";

  if (!title || !description || !location || !date) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  const newEvent = new Event({
    title,
    description,
    location,
    price,
    date: new Date(date),
    image: imagePath,
    createdBy: user._id,
  });

  await newEvent.save();

  return { message: "Event created successfully", event: newEvent };
});
