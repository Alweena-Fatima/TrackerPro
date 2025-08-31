import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Company from "./model/form.model.js";
import User from "./model/user.model.js";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import ScheduledEmail from "./model/scheduledEmail.model.js";
import sendReminder from "./utils/mailer.js";
// Initialize Express app
const app = express();
// Example: send test email
app.get("/send-test", async (req, res) => {
  await sendReminder("test@example.com", "Google", new Date());
  res.send("Reminder sent!");
});
// Middleware
// Enable CORS for all routes to allow cross-origin requests from the frontend
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// JWT Secret (should be an environment variable in a real-world app)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here-change-in-production";

// Database Connection
// Connect to the MongoDB Atlas cluster
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Database connection error:", err));
// ====================================================================
// AUTHENTICATION ROUTES
// ====================================================================

// Route for new user signup
// POST /signup
// Creates a new user with a hashed password and returns a JWT token
app.post("/signup", async (req, res) => {
    try {
        const { userid, password } = req.body;
        // Basic input validation
        if (!userid || !password) {
            return res.status(400).json({ success: false, message: "User ID and password are required." });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ userid });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "This user already exists." });
        }
        // Hash the password for security
        const saltRound = 12;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        // Create and save the new user
        const newUser = new User({ userid, password: hashedPassword });
        const savedUser = await newUser.save();
        // Generate a JWT token for the new user
        const token = jwt.sign({ userId: savedUser._id, userid: savedUser.userid }, JWT_SECRET, { expiresIn: '24h' });
        // Send a success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: { id: savedUser._id, userid: savedUser.userid }
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ success: false, message: "Server error during signup." });
    }
});

// Route for user login
// POST /login
// Authenticates a user and returns a JWT token
app.post("/login", async (req, res) => {
    try {
        const { userid, password } = req.body;
        // Basic input validation
        if (!userid || !password) {
            return res.status(400).json({ success: false, message: "User ID and password are required." });
        }
        // Find the user by their ID
        const loginUser = await User.findOne({ userid });
        if (!loginUser) {
            return res.status(401).json({ success: false, message: "Invalid User ID. Please sign up." });
        }
        // Compare the provided password with the hashed password in the database
        const isUserPass = await bcrypt.compare(password, loginUser.password);
        if (!isUserPass) {
            return res.status(401).json({ success: false, message: "Invalid password." });
        }
        // Update the last login timestamp
        loginUser.lastLogin = new Date();
        await loginUser.save();
        // Generate a JWT token
        const token = jwt.sign({ userId: loginUser._id, userid: loginUser.userid }, JWT_SECRET, { expiresIn: '24h' });
        // Send a success response with the token
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: { id: loginUser._id, userid: loginUser.userid }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});


// Middleware to verify JWT token
// This protects all routes that require authentication
const authtoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required.' });
    }
    // Verify the token's signature and expiration
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
        }
        // Attach user info from the token to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

// ====================================================================
// COMPANY ROUTES (PROTECTED)
// All routes below use the 'authtoken' middleware
// ====================================================================

// Route to get all companies for the authenticated user
// GET /companies
app.get("/companies", authtoken, async (req, res) => {
    try {
        // Find all companies where the 'userId' matches the authenticated user's ID
        const companies = await Company.find({ userId: req.user.userId });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to add a new company
// POST /companies
// Creates a new company entry and links it to the authenticated user
app.post("/companies", authtoken, async (req, res) => {
    try {
        const newCompany = new Company({ ...req.body, userId: req.user.userId });
        const savedCompany = await newCompany.save();
        return res.status(201).json(savedCompany); // Respond with 201 Created
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Route to update an existing company
// PUT /companies/:id
// Finds and updates a specific company document by its ID
app.put("/companies/:id", authtoken, async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        // Find the company by ID and user ID for a secure update
        const updatedCompany = await Company.findOneAndUpdate(
            { _id: id, userId: userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found or unauthorized to update" });
        }

        res.json(updatedCompany);
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Route to delete a company
// DELETE /companies/:id
// Finds and deletes a specific company document by its ID
app.delete("/companies/:id", authtoken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        // Find and delete the company, ensuring it belongs to the authenticated user
        const deletedCompany = await Company.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!deletedCompany) {
            return res.status(404).json({ error: "Company not found or unauthorized to delete" });
        }
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// This middleware must be applied to the route
// to ensure the request is handled correctly.
app.post("/notify", authtoken, async (req, res) => {
  try {
    const { email, companyId } = req.body;
    if (!email || !companyId) {
      return res.status(400).json({ message: "Email and companyId required" });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Security check: Ensure the user is authorized to notify for this company
    if (company.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Send the reminder
    await sendReminder(email, company.company, company.deadline);

    // Success response in JSON format
    res.status(200).json({ message: `Notification sent to ${email} for ${company.companyName}` });
  } catch (err) {
    console.error(err);
    // Always return a JSON response, even on error
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.post("/schedule-notification",authtoken, async (req, res) => {
  const { email, companyId } = req.body;
  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ message: "Company not found" });

  const sendTime = new Date(company.deadline);
  sendTime.setHours(sendTime.getHours() - 1); // deadline se 1 ghante pehle

  const scheduled = new ScheduledEmail({
    companyId,
    userEmail: email,
    sendTime,
  });
  await scheduled.save();

  res.json({ message: "Email scheduled successfully" });
});

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const emails = await ScheduledEmail.find({ status: "pending", sendTime: { $lte: now } });

  for (let job of emails) {
    const company = await Company.findById(job.companyId);
    if (company) {
      await sendReminder(job.userEmail, company.company, company.deadline);
      job.status = "sent";
      await job.save();
    }
  }
});
// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));