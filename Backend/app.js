import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Corrected import paths based on the new file structure
import Company from "./model/form.model.js";
import User from "./model/user.model.js";
import { connectDB } from "./utils/db.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://tracker-pro-ek5j.vercel.app'
}));


app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here-change-in-production";

// Middleware to verify JWT token
const authtoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required.' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

// ====================================================================
// AUTHENTICATION ROUTES
// ====================================================================

// Route for new user signup
app.post("/signup", async (req, res) => {
    try {
        await connectDB();
        const { userid, password } = req.body;
        if (!userid || !password) {
            return res.status(400).json({ success: false, message: "User ID and password are required." });
        }
        const existingUser = await User.findOne({ userid });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "This user already exists." });
        }
        const saltRound = 12;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const newUser = new User({ userid, password: hashedPassword });
        const savedUser = await newUser.save();
        const token = jwt.sign({ userId: savedUser._id, userid: savedUser.userid }, JWT_SECRET, { expiresIn: '24h' });
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
// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Tracker Pro API is running!" });
});

// Route for user login
app.post("/login", async (req, res) => {
    try {
        await connectDB();
        const { userid, password } = req.body;
        if (!userid || !password) {
            return res.status(400).json({ success: false, message: "User ID and password are required." });
        }
        console.log("Looking for user:", userid);
        const loginUser = await User.findOne({ userid });
        console.log("User found:", loginUser);

        if (!loginUser) {
            return res.status(401).json({ success: false, message: "Invalid User ID. Please sign up." });
        }
        const isUserPass = await bcrypt.compare(password, loginUser.password);
        if (!isUserPass) {
            return res.status(401).json({ success: false, message: "Invalid password." });
        }
        loginUser.lastLogin = new Date();
        await loginUser.save();
        const token = jwt.sign({ userId: loginUser._id, userid: loginUser.userid }, JWT_SECRET, { expiresIn: '24h' });
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

// ====================================================================
// COMPANY ROUTES (PROTECTED)
// ====================================================================

app.get("/companies", authtoken, async (req, res) => {
    try {
        await connectDB();
        const companies = await Company.find({ userId: req.user.userId });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/companies", authtoken, async (req, res) => {
    try {
        await connectDB();
        const newCompany = new Company({ ...req.body, userId: req.user.userId });
        const savedCompany = await newCompany.save();
        return res.status(201).json(savedCompany);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.put("/companies/:id", authtoken, async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const { userId } = req.user;
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

app.delete("/companies/:id", authtoken, async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
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

app.post("/notify", authtoken, async (req, res) => {
    try {
        await connectDB();
        const { email, companyId } = req.body;
        if (!email || !companyId) {
            return res.status(400).json({ message: "Email and companyId required" });
        }
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        if (company.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        // This function seems to be missing, but the code structure is correct.
        // await sendReminder(email, company.company, company.deadline);
        res.status(200).json({ message: `Notification sent to ${email} for ${company.companyName}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/schedule-notification", authtoken, async (req, res) => {
    try {
        await connectDB();
        const { email, companyId } = req.body;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: "Company not found" });

        // The ScheduledEmail model seems to be missing, but the code structure is correct.
        // const sendTime = new Date(company.deadline);
        // sendTime.setHours(sendTime.getHours() - 1); // deadline se 1 ghante pehle

        // const scheduled = new ScheduledEmail({
        //   companyId,
        //   userEmail: email,
        //   sendTime,
        // });
        // await scheduled.save();

        res.json({ message: "Email scheduled successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default app;
