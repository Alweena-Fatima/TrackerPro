import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import ScheduledEmail from "../model/scheduledEmail.model.js";
import Company from "../model/form.model.js";
import sendReminder from "../utils/mailer.js";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// This function will be triggered by Vercel cron
export default async function handler(req, res) {
  try {
    await connectDB();

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

    res.status(200).json({ message: `${emails.length} emails sent successfully.` });
  } catch (err) {
    console.error("Scheduled email error:", err);
    res.status(500).json({ message: "Error sending scheduled emails" });
  }
}
