// config/db.js — MongoDB connection setup
import mongoose from "mongoose";

/**
 * Connect to MongoDB using Mongoose
 * Environment variables required: MONGO_URI
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/quantyx";
    
    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 * Useful for graceful shutdown
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnect failed:", error.message);
    process.exit(1);
  }
};

export default mongoose;
