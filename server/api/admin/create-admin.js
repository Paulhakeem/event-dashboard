import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import connectDB from "../../utils/mongoose.js";
import { requireAuth } from "../../utils/requireAuth.js";
import nodemailer from "nodemailer";

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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // 🔐 Require authenticated user
  await requireAuth(event);

  await connectDB();

  const authUser = event.context.user;

  // 🔒 Only admins can create other admins
  if (!authUser || authUser.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied. Admins only.",
    });
  }

  // 📦 Read request body
  const { firstName, lastName, email, password } = await readBody(event);

  // ✅ Validate input
  if (![firstName, lastName, email, password].every(Boolean)) {
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

  // 🚫 Prevent duplicate admins
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "User with this email already exists",
    });
  }

  // 🔐 Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  // 👤 Create admin
  const admin = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "organiser",
    isEmailVerified: false,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: Date.now() + 10 * 60 * 1000, // 10 mins
  });

   /* ---------- SEND EMAIL ---------- */
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
  
    /* ---------- RESPONSE (NO TOKEN YET) ---------- */
    return {
      message: "Registration successful. Verify your email to continue.",
      email,
    };

  return {
    success: true,
    message: "organiser created successfully",
    admin: {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    },
  };
});
