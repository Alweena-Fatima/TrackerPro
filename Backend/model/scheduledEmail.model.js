import mongoose from 'mongoose';

const scheduledEmailSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    sendTime: {
        type: Date,
        required: true,
    },
    sent: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const ScheduledEmail = mongoose.model('ScheduledEmail', scheduledEmailSchema);

export default ScheduledEmail;
