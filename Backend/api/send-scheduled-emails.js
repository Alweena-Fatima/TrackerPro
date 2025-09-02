import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import ScheduledEmail from "../../model/scheduledEmail.model.js";
import Company from "../../model/form.model.js";
import sendReminder from "../../utils/mailer.js";

// Cache DB connection for serverless
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) return cachedDb;

  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });

  console.log("Database connected successfully");
  cachedDb = db;
  return db;
};

// Limit batch size to avoid timeout
const BATCH_SIZE = 5;

export default async function handler(req, res) {
  try {
    await connectDB();

    const now = new Date();

    // Fetch only pending emails whose sendTime has arrived
    const emails = await ScheduledEmail.find({
      status: "pending",
      sendTime: { $lte: now },
    }).limit(BATCH_SIZE);

    if (!emails.length) {
      return res.status(200).json({ message: "No emails to send." });
    }

    // Process emails sequentially to avoid serverless timeout
    for (const job of emails) {
      const company = await Company.findById(job.companyId);
      if (company) {
        try {
          await sendReminder(job.userEmail, company.company, company.deadline);
          job.status = "sent";
          await job.save();
          console.log(`Email sent to ${job.userEmail} for ${company.company}`);
        } catch (err) {
          console.error(`Failed to send email to ${job.userEmail}:`, err);
          // Keep status as "pending" so next run retries
        }
      } else {
        console.warn(`Company not found for job ${job._id}`);
        job.status = "failed";
        await job.save();
      }
    }

    res.status(200).json({ message: `${emails.length} emails processed.` });
  } catch (err) {
    console.error("Scheduler error:", err);
    res.status(500).json({ message: "Error sending scheduled emails" });
  }
}
