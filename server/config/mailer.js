const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Swastik Network" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Verify your Swastik account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0f0f1a;color:#fff;padding:40px;border-radius:12px;">
        <h1 style="color:#6c63ff">Welcome to Swastik 🎓</h1>
        <p>Thanks for registering! Click the button below to verify your university email:</p>
        <a href="${verifyUrl}" style="display:inline-block;margin-top:20px;padding:14px 28px;background:#6c63ff;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Verify Email
        </a>
        <p style="margin-top:30px;font-size:12px;color:#888;">This link expires in 24 hours. If you didn't register, ignore this email.</p>
      </div>
    `,
  });
};

const sendNotificationEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Swastik Network" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendVerificationEmail, sendNotificationEmail };
