import nodemailer from 'nodemailer';
import { sendOTP as fast2smsSend } from './sms.js';

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}

export async function sendEmail(to, subject, body, attachments) {
  const t = getTransporter();
  if (!t) {
    console.log(`[Email-Simulation] to=${to} subject=${subject} body=${body}`);
    return { simulated: true };
  }
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: body,
      html: body?.includes('<') ? body : undefined,
      attachments: attachments || []
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email delivery failure:', err.message);
    console.log(`[Email-Fallback] to=${to} subject=${subject} body=${body}`);
    return { ok: false, error: err.message };
  }
}

export async function sendWhatsApp(to, message) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const normalizedPhone = String(to || '').replace(/\D/g, '').replace(/^0+/, '');
  const recipient = normalizedPhone.length === 10 ? `91${normalizedPhone}` : normalizedPhone;

  if (!recipient) {
    return { ok: false, error: 'Missing WhatsApp recipient' };
  }

  if (!phoneNumberId || !token) {
    console.log(`[WhatsApp-Simulation] to=${recipient} message=${message}`);
    return { simulated: true };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { preview_url: false, body: message }
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'WhatsApp delivery failed');
    return { ok: true, data };
  } catch (err) {
    console.error('WhatsApp delivery failure:', err.message);
    return { ok: false, error: err.message };
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
