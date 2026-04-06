import fs from 'fs';
import crypto from 'crypto';

const file = process.argv[2];
if (!file) {
  console.log('Usage: node scripts/razorpayWebhookTest.js <payload.json>');
  process.exit(1);
}

const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';
const raw = fs.readFileSync(file);
const signature = crypto.createHmac('sha256', secret).update(raw).digest('hex');

console.log('Signature:', signature);
console.log('Use header: x-razorpay-signature:', signature);
