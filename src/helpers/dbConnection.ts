import mongoose from "mongoose";
import { Redis } from "ioredis";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL ?? "");
    return true;
  } catch (err: any) {
    console.warn(`Error connecting to the database: ${err}`);
    return false;
  }
};

export const redis = new Redis({
  host: "localhost",
  port: 6379,
});

export default connectDB;
