import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root of server directory
dotenv.config();

const requiredKeys = [
  'MONGO_URI',
  'JWT_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'FAST2SMS_API_KEY'
];

/**
 * Validates that all required environment variables are present.
 * Throws an error if any mission-critical keys are missing.
 */
export const validateConfig = () => {
  const missing = requiredKeys.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ CONFIG ERROR: Missing Critical Environment Nodes:', missing);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Production Launch Aborted: Missing ${missing.join(', ')}`);
    }
  } else {
    console.log('✅ Environment Hub: All Critical Nodes Synchronized.');
  }
};

const config = {
  port: process.env.PORT || 5001,
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  sms: {
    fast2smsKey: process.env.FAST2SMS_API_KEY,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  google: {
    mapsKey: process.env.GOOGLE_MAPS_API_KEY,
  }
};

export default config;
