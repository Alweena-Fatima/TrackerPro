import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendReminder = async (to, companyName, deadline) => {
    // 1. Create a transporter
    // IMPORTANT: Use an "App Password" from your email provider, not your regular password.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or your email provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address from .env
            pass: process.env.EMAIL_PASS, // Your App Password from .env
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: `"TrackerPro" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `Reminder: Application Deadline for ${companyName}`,
        html: `
            <p>Hi there,</p>
            <p>This is a reminder that your application deadline for <strong>${companyName}</strong> is approaching.</p>
            <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
            <p>Good luck!</p>
            <p>Best,</p>
            <p>The TrackerPro Team</p>
        `,
    };

    // 3. Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
    }
};

export default sendReminder;
