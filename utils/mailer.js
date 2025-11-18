// utils/mailer.js
require("dotenv").config();

// Using Resend HTTP API instead of SMTP
// Works on Render because it's just HTTPS (port 443)

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM =
  process.env.EMAIL_FROM || "SurvEase <onboarding@resend.dev>";
const EMAIL_ENABLED = process.env.EMAIL_ENABLED !== "false"; // default: enabled

async function sendEmail(options) {
  const { to, subject, html, text } = options;

  if (!EMAIL_ENABLED) {
    console.log("[MAILER] Email disabled, skipping send:", to);
    return;
  }

  if (!RESEND_API_KEY) {
    console.error("[MAILER] RESEND_API_KEY missing, cannot send email");
    return;
  }

  try {
    // Node 18+ has global fetch; Render uses Node 22.x
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[MAILER] Resend error:", data);
    } else {
      console.log("[MAILER] Email sent via Resend:", data.id || data);
    }
  } catch (err) {
    console.error("[MAILER] HTTP error sending email:", err.message || err);
  }
}

// Keep both names so existing controllers continue to work
module.exports = {
  sendEmail,
  sendSignupEmail: sendEmail,
};
