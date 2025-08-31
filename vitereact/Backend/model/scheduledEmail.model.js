import mongoose from "mongoose";

const scheduledEmailSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  userEmail: { type: String, required: true },
  sendTime: { type: Date, required: true }, // deadline - 1 hour
  status: { type: String, enum: ["pending", "sent"], default: "pending" },
});

export default mongoose.model("ScheduledEmail", scheduledEmailSchema);
