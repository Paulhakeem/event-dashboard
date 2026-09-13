import { Event } from "../../models/Events.js";
import connectDB from "../../utils/mongoose.js";
import { requireAuth } from "../../utils/requireAuth.js";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { assertValidImage } from "../../utils/imageUpload.js";

export default defineEventHandler(async (event) => {
  await connectDB();
  const config = useRuntimeConfig();

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  // Verify user (also enforces suspension + email verification)
  const authUser = await requireAuth(event);
  if (authUser.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Access denied" });
  }

  // Parse form data (text + image)
  const form = formidable({
    multiples: false,
    maxFields: 20,
    maxFieldSize: 1024 * 1024,
    maxFileSize: 10 * 1024 * 1024,
    maxFiles: 1,
  });
  const [fields, files] = await form.parse(event.node.req);

  const title = String(fields.title?.[0] || "");
  const description = String(fields.description?.[0] || "");
  const location = String(fields.location?.[0] || "");
  const date = String(fields.date?.[0] || "");
  const regular =
    fields.regular?.[0] !== undefined ? Number(fields.regular?.[0]) : undefined;
  const vip =
    fields.vip?.[0] !== undefined ? Number(fields.vip?.[0]) : undefined;
  const vvip =
    fields.vvip?.[0] !== undefined ? Number(fields.vvip?.[0]) : undefined;
  let customTickets = [];
  try {
    const raw = fields.customTickets?.[0];
    if (raw) customTickets = JSON.parse(raw);
  } catch {
    customTickets = [];
  }
  const TicketQuantity = Number(fields.TicketQuantity?.[0] || 0);
  const freeEntry = String(fields.freeEntry?.[0] || "false") === "true";
  const status = String(fields.status?.[0] || "upcoming");
  const eventType = String(fields.eventType?.[0] || "other");

  if (
    !title ||
    !description ||
    !location ||
    !date ||
    !eventType ||
    !status ||
    !files.image?.[0]
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  // Upload image to Cloudinary (validated type + size)
  const imageFile = files.image[0];
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
  if ((imageFile?.size ?? 0) > MAX_IMAGE_BYTES) {
    throw createError({
      statusCode: 400,
      statusMessage: `File size too large. Got ${imageFile.size}. Maximum is ${MAX_IMAGE_BYTES}.`,
    });
  }
  assertValidImage(imageFile);

  const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
    folder: "events",
    use_filename: true,
    unique_filename: true,
    allowed_formats: ["jpg", "png", "webp", "gif", "avif"],
    resource_type: "image",
  });

  // Clean up temp file
  fs.unlink(imageFile.filepath, () => {});

  // Save event in MongoDB
  const newEvent = new Event({
    title,
    description,
    freeEntry,
    location,
    date: new Date(date),
    regular,
    vip,
    vvip,
    customTickets: customTickets.length > 0 ? customTickets : undefined,
    TicketQuantity,
    status,
    eventType,
    image: uploadResult.secure_url,
    createdBy: authUser.id,
  });

  await newEvent.save();

  return {
    message: "Event created successfully",
    event: newEvent,
  };
});