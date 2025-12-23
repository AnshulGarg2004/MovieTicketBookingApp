const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailProps {
    to : any,
    subject : any,
    body : any
}

// Send an email using async/await
export const sendEmail = async ({ to, subject, body }: SendEmailProps) => {
  const info = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body, // ✅ IMPORTANT: use html, not body
  });

  console.log("Message sent:", info.messageId);
  return info;
};
