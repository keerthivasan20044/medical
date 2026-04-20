/**
 * Environment Variable Key Checker
 * 
 * This utility verifies that all required environment variables are present.
 * It provides clear warnings or errors if keys are missing, which is 
 * critical for deployment and feature stability.
 */

const REQUIRED_KEYS = [
  'MONGO_URI',
  'JWT_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const OPTIONAL_KEYS = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'TWILIO_SID',
  'TWILIO_AUTH_TOKEN'
];

export const checkEnvKeys = () => {
  const missing = [];
  const placeholders = [];

  REQUIRED_KEYS.forEach(key => {
    const val = process.env[key];
    if (!val) {
      missing.push(key);
    } else if (val.includes('your_') || val.includes('change-me') || val.includes('replace-with')) {
        placeholders.push(key);
    }
  });

  const missingOptional = OPTIONAL_KEYS.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing Required Environment Variables:');
    missing.forEach(key => console.error(`   - ${key}`));
  }

  if (placeholders.length > 0) {
    console.warn('⚠️ WARNING: Environment Variables contain placeholders:');
    placeholders.forEach(key => console.warn(`   - ${key}`));
  }

  if (missingOptional.length > 0) {
    console.log('ℹ️  Note: Some optional features (Email/SMS) are disabled due to missing keys:');
    missingOptional.forEach(key => console.log(`   - ${key}`));
  }

  if (missing.length === 0 && placeholders.length === 0) {
    console.log('✅ Environment keys verified successfully.');
  }

  return {
    success: missing.length === 0,
    missing,
    placeholders
  };
};
