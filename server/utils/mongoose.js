import mongoose from "mongoose";

let isConnected = false; // track the connection status

const connectDB = async () => {
  const config = useRuntimeConfig();
  const mongoUrl = config.mongoUrl?.trim();

  if (!mongoUrl) {
    throw new Error(
      "Missing mongoUrl runtime config. Please set CONNECTION_STR in .env.",
    );
  }

  if (isConnected) return; // already connected, skip

  const normalizedUrl = mongoUrl.replace(
    /^mongodb:\/\/localhost(?=$|[:\/])/i,
    "mongodb://127.0.0.1",
  );

  try {
    await mongoose.connect(normalizedUrl, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; // let Nitro handle it
  }
};

export default connectDB;
