import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import nodemailer from "nodemailer";

/* ---------------- SPAM EMAIL BLOCK ---------------- */
const blockedDomains = [
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "yopmail.com",
  "dispostable.com",
  "fakeinbox.com",
];

const isSpamEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return true;

  const domain = email.split("@")[1].toLowerCase();
  return blockedDomains.includes(domain);
};
/* -------------------------------------------------- */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  await connectDB();

  // Cloudinary config
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  // Parse form data
  const form = formidable({ keepExtensions: true });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const firstName = fields.firstName?.toString().trim();
  const lastName = fields.lastName?.toString().trim();
  const email = fields.email?.toString().trim().toLowerCase();
  const password = fields.password?.toString().trim();
  const role = fields.role?.toString().trim() || "user";

  /* ---------- BASIC VALIDATION ---------- */
  if (!firstName || !lastName || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  if (isSpamEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Disposable or invalid email is not allowed",
    });
  }

  /* ---------- CHECK EXISTING USER ---------- */
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email already registered",
    });
  }

  /* ---------- PROFILE IMAGE ---------- */
  let imagePath = null;
  const imageFile = files.profileImage;

  if (imageFile) {
    if (imageFile.size > 5 * 1024 * 1024) {
      throw createError({
        statusCode: 400,
        statusMessage: "Image must be less than 5MB",
      });
    }

    const upload = await cloudinary.uploader.upload(imageFile.filepath, {
      folder: "profiles",
    });

    imagePath = upload.secure_url;
    fs.unlink(imageFile.filepath, () => {});
  }

  /* ---------- PASSWORD + VERIFICATION ---------- */
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const newUser = new User({
    profileImage: imagePath,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    isEmailVerified: false,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: Date.now() + 10 * 60 * 1000, // 10 mins
  });

  await newUser.save();

  /* ---------- SEND EMAIL ---------- */
  if (config.emailUsername && config.emailPass) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.emailUsername,
        pass: config.emailPass,
      },
    });

    await transporter.sendMail({
      from: `"Velora Events" <${config.emailUsername}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code:</p>
        <h1>${verificationCode}</h1>
        <p>Expires in 10 minutes</p>
      `,
    });
  } else {
    console.warn("SMTP credentials missing; logged verification code instead:", verificationCode);
  }

  /* ---------- RESPONSE (NO TOKEN YET) ---------- */
  return {
    message: "Registration successful. Verify your email to continue.",
    email,
  };
});
