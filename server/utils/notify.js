import nodemailer from 'nodemailer';
import { sendOTP as fast2smsSend } from './sms.js';

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
  try {
    // If message contains OTP pattern, extract it or just send whole message
    const otpMatch = message.match(/\b\d{6}\b/);
    if (otpMatch) {
       await fast2smsSend(to, otpMatch[0]);
    } else {
       console.log(`[SMS] Sending message via simulation (Fast2SMS preferred for OTP): ${to}: ${message}`);
    }
  } catch (err) {
    console.error('SMS delivery failure:', err.message);
  }
}
