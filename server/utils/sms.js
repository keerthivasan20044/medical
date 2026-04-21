import config from '../config/config.js';

/**
 * Fast2SMS Node Integration
 * Synchronizes OTP delivery across Indian telecom clusters.
 * Uses native fetch (Node 18+) or standard HTTPS protocol.
 */
export const sendOTP = async (phone, otp) => {
  const apiKey = config.sms.fast2smsKey;
  
  if (config.env === 'development' || !apiKey) {
    console.log(`[SMS Simulation] OTP for ${phone}: ${otp}`);
    return { success: true, message: 'Simulation Mode Active' };
  }

  try {
    const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&numbers=${phone}`);
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
