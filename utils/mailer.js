// utils/mailer.js
const nodemailer = require("nodemailer");

const ENABLE_EMAIL = process.env.ENABLE_EMAIL === "true";

// Only create transporter when email is explicitly enabled (e.g. on localhost)
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

  // Optional: verify, but don't crash on failure
  transporter.verify((err) => {
    if (err) {
      console.error("SMTP verify error (ignored):", err.message);
    } else {
      console.log("SMTP server is ready to take messages");
    }
  });
}

async function sendSignupEmail(options) {
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

module.exports = { sendSignupEmail };
