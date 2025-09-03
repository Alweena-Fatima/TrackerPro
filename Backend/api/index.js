import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js'; // Your main Express app
// UPDATED: Import path now matches your new file name
import startScheduledEmailChecks from './startScheduledEmailChecks.js'; 

// Configure environment variables
dotenv.config();

// --- STARTING SERVER ---
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
            
            // Start the cron job after the server is running
            startScheduledEmailChecks(); 
            console.log("Cron job for scheduled emails has been started.");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit the application if the DB connection fails
    });

