import { User } from "../../models/User.js";
import { Event } from "../../models/Events.js";
import { Notification } from "../../models/Notification.js";
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
  const user = await User.findById(authUser.id);
  if (!user || user.role !== "organiser") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
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
  const TicketQuantityRaw = Number(fields.TicketQuantity?.[0] || 0);
  const maxTicketsPerUserRaw = fields.maxTicketsPerUser?.[0];
  const maxTicketsPerUser =
    maxTicketsPerUserRaw == null || maxTicketsPerUserRaw === ""
      ? null
      : Number(maxTicketsPerUserRaw);
  const freeEntry = String(fields.freeEntry?.[0] || "false") === "true";
  // Force events created by organisers to be pending approval by admin
  const status = "pending";
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
      statusMessage: "Image size exceeds 10MB limit",
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

  // remove temp file
  fs.unlink(imageFile.filepath, () => {});

  const normalizedTickets = (customTickets || [])
    .filter((t) => t && t.name)
    .map((t) => ({
      name: String(t.name).trim(),
      price: Number(t.price) || 0,
      quantity: Number(t.quantity) || 0,
      availableQuantity: Number(t.quantity) || 0,
    }));

  if (!freeEntry && normalizedTickets.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Add at least one ticket type with available quantity",
    });
  }

  let TicketQuantity = TicketQuantityRaw;
  if (!freeEntry) {
    TicketQuantity = normalizedTickets.reduce(
      (sum, t) => sum + (Number(t.quantity) || 0),
      0,
    );
  }

  // Save event in MongoDB
  const newEvent = new Event({
    title,
    description,
    freeEntry,
    location,
    date,
    regular,
    vip,
    vvip,
    customTickets: normalizedTickets.length > 0 ? normalizedTickets : undefined,
    TicketQuantity,
    maxTicketsPerUser,
    status,
    eventType,
    image: uploadResult.secure_url,
    role: user.role,
    createdBy: user._id,
  });

  await newEvent.save();

  try {
    return {
      message: "Event created successfully and pending admin approval",
      event: newEvent,
      eventType,
      image: uploadResult.secure_url,
    };
  } catch (err) {
    return {
      message: "Event created but failed",
      event: newEvent,
      error: err?.message || String(err),
      eventType,
      image: uploadResult.secure_url,
    };
  }
});