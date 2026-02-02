import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import nodemailer from "nodemailer";

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
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const firstName = fields.firstName?.toString().trim();
  const lastName = fields.lastName?.toString().trim();
  const email = fields.email?.toString().trim();
  const password = fields.password?.toString().trim();
  const role = fields.role?.toString().trim() || "user";
  const adminNumber = fields.adminNumber?.toString().trim();

  // Validation
  if (!firstName || !lastName || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required",
    });
  }

  // Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email already taken",
    });
  }
  // Upload profile image if provided
  const imageFile = files.profileImage;
  let imagePath = null;

  if (imageFile) {
    if (imageFile.size > 5 * 1024 * 1024) {
      throw createError({
        statusCode: 400,
        statusMessage: "Image size should be less than 5MB",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
      folder: "profiles",
      use_filename: true,
      unique_filename: true,
    });

    imagePath = uploadResult.secure_url;

    // Remove temp file
    fs.unlink(imageFile.filepath, () => {});
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Generate verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const newUser = new User({
    profileImage: imagePath,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: Date.now() + 10 * 60 * 1000, // 10 mins
    adminNumber,
    role,
  });

  // Create JWT
  const token = jwt.sign(
    {
      id: newUser._id,
      fname: newUser.firstName,
      sname: newUser.lastName,
      email: newUser.email,
      adminNumber: newUser.adminNumber,
      role: newUser.role,
    },
    config.secretStr,
    { expiresIn: "1d" },
  );

  // Email transport
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
    from: `"Event Dashboard" <${config.emailUsername}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${verificationCode}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  return {
    message: "User registered successfully",
    token,
    user: {
      id: newUser._id,
      profileImage: imagePath,
      firstName,
      lastName,
      email,
      adminNumber,
      role,
      joinedAt: newUser.joinedAt,
    },
  };
});
