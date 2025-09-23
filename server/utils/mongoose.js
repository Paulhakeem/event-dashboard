import mongoose from "mongoose";

let isConnected = false; // track the connection status

const connectDB = async () => {
  const config = useRuntimeConfig();

  if (isConnected) return; // already connected, skip

  try {
    await mongoose.connect(config.mongoUrl);

    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; // let Nitro handle it
  }
};

export default connectDB;
