import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  joinedAt: {type: Date, default: Date.now}
});
export const User = mongoose.models.User || mongoose.model("User", userSchema);
