import mongoose from "mongoose";

let cachedDb = null;

export const connectDB = async () => {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedDb = db;
  return db;
};
