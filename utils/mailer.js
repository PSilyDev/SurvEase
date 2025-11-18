// utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const ENABLE_EMAIL = process.env.ENABLE_EMAIL === "true";

let transporter = null;

if (ENABLE_EMAIL) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.error("SMTP verify error (ignored):", err.message);
    } else {
      console.log("SMTP server is ready to take messages");
    }
  });
}

async function sendEmail(options) {
  if (!transporter) {
    console.log("Email disabled, skipping send:", options.to);
    return;
  }

  try {
    await transporter.sendMail(options);
  } catch (err) {
    console.error("Email send failed (ignored):", err.message);
  }
}

// keep backwards compatibility
module.exports = {
  sendEmail,
  sendSignupEmail: sendEmail,
};
