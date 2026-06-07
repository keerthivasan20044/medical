import { sendEmail, sendWhatsApp } from '../utils/notify.js';
import { Router } from 'express';

const router = Router();

/**
 * Test Notifications
 * Endpoints to test Nodemailer + WhatsApp integration
 */

// Test Email
router.post('/test-email', async (req, res) => {
  try {
    const { email = 'keerthistrange@gmail.com', subject = 'Test Email' } = req.body;

    const htmlBody = `
      <div style="font-family: Arial; max-width: 600px; padding: 20px;">
        <h1>✅ Email System Working!</h1>
        <p>This is a test email from MediReach notification system.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p>If you're seeing this, your Nodemailer + Gmail SMTP is configured correctly!</p>
        <button style="background: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer;">
          Test Button
        </button>
      </div>
    `;

    const result = await sendEmail(email, subject, htmlBody);
    
    res.status(result.ok ? 200 : 400).json({
      success: result.ok,
      message: result.ok ? 'Email sent successfully!' : result.error,
      details: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test WhatsApp
router.post('/test-whatsapp', async (req, res) => {
  try {
    const { phone = '919345737726', message = 'Hello from MediReach! This is a test WhatsApp message.' } = req.body;

    const result = await sendWhatsApp(phone, message);

    res.status(result.ok ? 200 : 400).json({
      success: result.ok,
      message: result.ok ? 'WhatsApp message sent!' : result.error,
      details: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test Both (Email + WhatsApp)
router.post('/test-all', async (req, res) => {
  try {
    const { email = 'keerthistrange@gmail.com', phone = '919345737726' } = req.body;

    const emailBody = `
      <div style="font-family: Arial; max-width: 600px; padding: 20px;">
        <h1>✅ MediReach Notification System Active</h1>
        <p>Both Email and WhatsApp integrations are working!</p>
        <p>📧 Email: ${email}</p>
        <p>📱 WhatsApp: ${phone}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `;

    const emailResult = await sendEmail(
      email,
      '✅ MediReach Notification Test',
      emailBody
    );

    const whatsappResult = await sendWhatsApp(
      phone,
      `✅ MediReach Notification System\n\nBoth Email & WhatsApp are working!\n\nEmail: ${email}\nTime: ${new Date().toLocaleString()}`
    );

    res.status(200).json({
      success: emailResult.ok && whatsappResult.ok,
      email: { success: emailResult.ok, result: emailResult },
      whatsapp: { success: whatsappResult.ok, result: whatsappResult }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
