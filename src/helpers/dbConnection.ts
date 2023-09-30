import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    return true;
  } catch (err: any) {
    console.warn(`Error connecting to the database: ${err}`);
    return false;
  }
};

export default connectDB;
