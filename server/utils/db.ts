import mongoose from "mongoose";

export async function connectDB() {
  const url = process.env.MONGO_URL as string;
  try {
    await mongoose.connect(url);
    console.log("MongoDB Connection");
  } catch (error) {
    console.log("MongoDB Fail", error);
  }
}
