import mongoose from "mongoose";

let isConnected = false; // track the connection status

export const connectToDatabase = async () => {
  if (isConnected) return; // if already connected, return

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true; // set the connection status to true
  console.log("Connected to MongoDB");
};
