import fs from "fs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

function sniffMagic(filepath) {
  try {
    const buffer = Buffer.alloc(16);
    const fd = fs.openSync(filepath, "r");
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);

    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return "jpeg";
    }
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return "png";
    }
    if (buffer.toString("ascii", 0, 4) === "GIF8") return "gif";
    if (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
      return "webp";
    }
    return null;
  } catch {
    return null;
  }
}

export function assertValidImage(file) {
  if (!file) return;

  const mimetype = String(file.mimetype || "").toLowerCase();
  if (mimetype && !ALLOWED_TYPES.has(mimetype)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Only JPG, PNG, WEBP, GIF or AVIF images are allowed",
    });
  }

  const originalName = String(file.originalFilename || "");
  const dotIndex = originalName.lastIndexOf(".");
  if (dotIndex >= 0) {
    const extension = originalName.slice(dotIndex).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid image file extension",
      });
    }
  }

  const magic = sniffMagic(file.filepath);
  if (!magic) {
    throw createError({
      statusCode: 400,
      statusMessage: "Uploaded file is not a valid image",
    });
  }
}