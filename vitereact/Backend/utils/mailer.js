import nodemailer from "nodemailer";

// async function to send reminder email
async function sendReminder(email, companyName, deadlineDate) {
  // Create a transporter using your real Gmail account
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' service
    auth: {
      user: 'alweenasabir123@gmail.com', // Replace this with your Gmail address
      pass: 'fvzr hoab aucy vivi' // Replace this with your generated App Password
    },
  });

  // mail details
  let mailOptions = {
    from: '"Placement Tracker" <alweenasabir123@gmail.com>',
    to: email,
    subject: `⏰ Urgent: Registration Deadline for ${companyName} - ${deadlineDate}`,
    text: `Hello! This is a reminder that the registration deadline for ${companyName} is ${deadlineDate}. Don't miss this opportunity!`,
    html: `<b>Hello!</b> This is a reminder that the registration deadline for <b>${companyName}</b> is <b>${deadlineDate}</b>.`,
  };

  try {
    // send mail
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

export default sendReminder;