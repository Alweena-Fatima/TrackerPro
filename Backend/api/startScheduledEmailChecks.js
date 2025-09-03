import cron from 'node-cron';
import ScheduledEmail from '../model/scheduledEmail.model.js';
import Company from '../model/form.model.js';
import sendReminder from '../utils/sendRemainder.js';

const startScheduledEmailChecks = () => {
    // Run this job every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running cron job: Checking for scheduled emails...');
        const now = new Date();

        try {
            // Find emails that are due to be sent and have not been sent yet
            const emailsToSend = await ScheduledEmail.find({
                sendTime: { $lte: now },
                sent: false,
            });

            if (emailsToSend.length === 0) {
                console.log('No scheduled emails to send at this time.');
                return;
            }

            for (const email of emailsToSend) {
                const company = await Company.findById(email.companyId);
                if (company) {
                    await sendReminder(email.userEmail, company.companyName, company.deadline);
                    // Mark the email as sent to prevent re-sending
                    email.sent = true;
                    await email.save();
                }
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });
};

export default startScheduledEmailChecks;
