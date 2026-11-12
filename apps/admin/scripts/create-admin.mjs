import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const pnpmStore = path.join(repoRoot, "node_modules/.pnpm");

const loadPackage = async (name) => {
  const entry = readdirSync(pnpmStore).find(
    (dir) => dir === name || dir.startsWith(`${name}@`),
  );
  if (!entry) throw new Error(`Cannot find ${name} in the pnpm store`);
  const pkgDir = path.join(pnpmStore, entry, "node_modules", name);
  const pkg = await import(pathToFileURL(path.join(pkgDir, "index.js")).href);
  return pkg.default ?? pkg;
};

const bcrypt = await loadPackage("bcryptjs");
const mongoose = await loadPackage("mongoose");

process.loadEnvFile(new URL("../.env", import.meta.url));

const email = (process.env.ADMIN_EMAIL || process.env.EMAIL_USERNAME || "")
  .trim()
  .toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";
const firstName = (process.env.ADMIN_FIRST_NAME || "Admin").trim();
const lastName = (process.env.ADMIN_LAST_NAME || "User").trim();

if (!email || !password) {
  console.error(
    "Set ADMIN_EMAIL (or EMAIL_USERNAME) and ADMIN_PASSWORD before running.",
  );
  process.exit(1);
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!passwordRegex.test(password)) {
  console.error(
    "ADMIN_PASSWORD must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
  );
  process.exit(1);
}

const mongoUrl = (process.env.CONNECTION_STR || "").trim();
if (!mongoUrl) {
  console.error("CONNECTION_STR is missing from apps/admin/.env");
  process.exit(1);
}

const normalizedUrl = mongoUrl.replace(
  /^mongodb:\/\/localhost(?=$|[:\/])/i,
  "mongodb://127.0.0.1",
);

await mongoose.connect(normalizedUrl, {
  family: 4,
  serverSelectionTimeoutMS: 10000,
});

try {
  const users = mongoose.connection.collection("users");
  const hashedPassword = await bcrypt.hash(password, 10);
  const existing = await users.findOne({ email });
  const now = new Date();

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          password: hashedPassword,
          role: "admin",
          isEmailVerified: true,
          accountStatus: "active",
          updatedAt: now,
        },
        $unset: {
          emailVerificationCode: "",
          emailVerificationExpires: "",
        },
      },
    );
    console.log(`Updated existing account as verified admin: ${email}`);
  } else {
    await users.insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin",
      permissions: [],
      accountStatus: "active",
      isEmailVerified: true,
      mfaEnabled: false,
      favoriteEvents: [],
      activityLog: [],
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Created verified admin account: ${email}`);
  }
} finally {
  await mongoose.disconnect();
}
