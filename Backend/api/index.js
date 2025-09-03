import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js'; // Your main Express app

// Configure environment variables
dotenv.config();

// --- STARTING SERVER ---
// These are your debug logs, they are still useful
console.log('Attempting to start server...');
console.log('MONGO_URI found:', !!process.env.MONGO_URI);
console.log('JWT_SECRET found:', !!process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Validate that the MONGO_URI is present
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
    process.exit(1); // Exit the application with an error code
}

// Connect to MongoDB and then start the server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");
        
        // Start listening for requests only after the DB connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running and listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit the application if the DB connection fails
    });