import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "tfex2",
  });

  console.log("📌 Connected to MongoDB");
}
