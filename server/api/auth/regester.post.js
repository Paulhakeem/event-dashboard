import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";

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

  const newUser = new User({
    profileImage: imagePath,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    adminNumber,
    role,
  });

  await newUser.save();

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
    { expiresIn: "1d" }
  );

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
