const nodemailer = require('nodemailer');

// Pluggable mailer.
//
// If SMTP env vars are configured (SMTP_HOST + SMTP_USER + SMTP_PASS), emails
// are sent for real via nodemailer. Otherwise we run in "dev" mode and simply
// log the message (including any action link) to the server console so flows
// like password reset remain testable without an email account.
//
// Required env vars for real delivery:
//   SMTP_HOST, SMTP_PORT (default 587), SMTP_USER, SMTP_PASS, MAIL_FROM

let transporter = null;

const isConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (!isConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

/**
 * Send an email. Never throws — delivery failures are logged so they don't
 * break the request flow that triggered them.
 * @param {{ to: string, subject: string, text?: string, html?: string }} opts
 */
const sendMail = async ({ to, subject, text, html }) => {
  const tx = getTransporter();

  if (!tx) {
    // Dev fallback — log instead of sending.
    console.log('\n[mailer:dev] Email not sent (SMTP not configured).');
    console.log(`  to:      ${to}`);
    console.log(`  subject: ${subject}`);
    if (text) console.log(`  text:    ${text}`);
    console.log('');
    return { delivered: false, dev: true };
  }

  try {
    await tx.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return { delivered: true };
  } catch (err) {
    console.error('[mailer] Failed to send email:', err.message);
    return { delivered: false, error: err.message };
  }
};

module.exports = { sendMail, isConfigured };
