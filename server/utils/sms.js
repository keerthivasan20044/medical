import config from '../config/config.js';

/**
 * Fast2SMS Node Integration
 * Synchronizes OTP delivery across Indian telecom clusters.
 * Uses native fetch (Node 18+) or standard HTTPS protocol.
 */
export const sendOTP = async (phone, otp) => {
  const apiKey = config.sms.fast2smsKey;
  const normalizedPhone = String(phone || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');

  if (!/^\d{10}$/.test(normalizedPhone)) {
    console.log(`[SMS Simulation] Invalid phone for OTP delivery: ${phone}`);
    return { success: false, message: 'Invalid phone number' };
  }
  
  if (config.env === 'development' || !apiKey) {
    console.log(`[SMS Simulation] OTP for ${normalizedPhone}: ${otp}`);
    return { success: true, message: 'Simulation Mode Active' };
  }

  try {
    const params = new URLSearchParams({
      authorization: apiKey,
      route: 'otp',
      variables_values: String(otp),
      numbers: normalizedPhone
    });
    const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`);
    const data = await response.json();
    
    if (data.return) {
      return { success: true, data };
    } else {
      throw new Error(data.message || 'Fast2SMS Protocol Failure');
    }
  } catch (error) {
    console.error('❌ SMS Protocol Failure:', error.message);
    throw error;
  }
};
