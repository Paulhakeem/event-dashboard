import jwt from "jsonwebtoken";
import connectDB from "~~/server/utils/mongoose";
import { User } from "~~/server/models/User";

const getAdmin = (event) => {
  const authHeader = getHeader(event, "authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, useRuntimeConfig().secretStr);
    if (decoded.role !== "admin") throw new Error("Admin access required");
    return decoded;
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }
};

const addActivity = (user, action, adminId, details) => {
  user.activityLog = user.activityLog || [];
  user.activityLog.push({ action, performedBy: adminId, details });
  if (user.activityLog.length > 50)
    user.activityLog = user.activityLog.slice(-50);
};

export default defineEventHandler(async (event) => {
  const admin = getAdmin(event);
  await connectDB();

  const body = await readBody(event);
  const ids = Array.isArray(body?.ids) ? body.ids : body?.id ? [body.id] : [];
  if (!ids.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "At least one user is required",
    });
  }

  const users = await User.find({ _id: { $in: ids } });
  if (!users.length) {
    throw createError({ statusCode: 404, statusMessage: "No users found" });
  }

  const action = body?.action;
  if (
    !["delete", "suspend", "activate", "role", "verify", "unverify"].includes(
      action,
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unsupported user action",
    });
  }

  if (
    action === "delete" &&
    users.some((user) => String(user._id) === String(admin.id))
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "You cannot delete your own account",
    });
  }

  if (
    ["suspend", "activate", "role", "permissions"].includes(action) &&
    users.some((user) => String(user._id) === String(admin.id)) &&
    action !== "permissions"
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "You cannot change your own account status or role",
    });
  }

  for (const user of users) {
    if (action === "delete") {
      await User.deleteOne({ _id: user._id });
      continue;
    }
    if (action === "suspend" || action === "activate") {
      user.accountStatus = action === "suspend" ? "suspended" : "active";
      addActivity(user, action, admin.id);
    } else if (action === "role") {
      if (!["admin", "organiser", "user"].includes(body.role)) {
        throw createError({ statusCode: 400, statusMessage: "Invalid role" });
      }
      user.role = body.role;
      addActivity(
        user,
        "role_changed",
        admin.id,
        `Role changed to ${body.role}`,
      );
    } else if (action === "permissions") {
      if (!Array.isArray(body.permissions)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Permissions must be an array",
        });
      }
      user.permissions = body.permissions.filter(
        (permission) => typeof permission === "string",
      );
      addActivity(user, "permissions_changed", admin.id);
    } else {
      user.isEmailVerified = action === "verify";
      addActivity(user, action, admin.id);
    }
    await user.save();
  }

  return { success: true, affected: users.length };
});
