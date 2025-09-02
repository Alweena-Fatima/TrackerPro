import mongoose from "mongoose";

// A global variable to cache the database connection
// This is critical for serverless functions to reuse connections
let cachedDb = null;

/**
 * Connects to the MongoDB database using the URI from environment variables.
 * It reuses an existing connection if one is available, which is
 * crucial for performance in a serverless environment.
 * @returns {Promise<mongoose.Mongoose>} The database connection object.
 */
export const connectDB = async () => {
  // If we already have a connection, return it
  if (cachedDb) {
    console.log("Using existing database connection.");
    return cachedDb;
  }

  try {
    // Connect to the database
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log("Database connected successfully.");
    // Cache the connection for future requests
    cachedDb = db;
    return db;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err; // Throw the error so the calling function can handle it
  }
};
