import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profileImage: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "organiser", "user"],
      default: "user",
    },
    emailVerificationCode: String,
    emailVerificationExpires: Date,
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
