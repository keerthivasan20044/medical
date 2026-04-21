import nodemailer from 'nodemailer';
import twilio from 'twilio';

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}

function getTwilioClient() {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function sendEmail(to, subject, body, attachments) {
  const t = getTransporter();
  if (!t) {
    console.log(`[Email-Simulation] to=${to} subject=${subject} body=${body}`);
    return;
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: body,
      attachments: attachments || []
    });
  } catch (err) {
    console.error('Email delivery failure:', err.message);
    console.log(`[Email-Fallback] to=${to} subject=${subject} body=${body}`);
  }
}

export async function sendSMS(to, message) {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[sms] to=${to} message=${message}`);
    return;
  }
  await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to, body: message });
}
