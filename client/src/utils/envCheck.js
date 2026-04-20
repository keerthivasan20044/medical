/**
 * Client-Side Environment Variable Checker
 * 
 * Verifies that essential public keys (Razorpay, etc.) are available.
 * This helps prevent runtime errors during payment flows or image uploads.
 */

export const checkClientEnv = () => {
    const required = [
      'VITE_API_BASE_URL',
      'VITE_RAZORPAY_KEY_ID'
    ];
  
    const missing = required.filter(key => !import.meta.env[key]);
  
    if (missing.length > 0) {
      console.warn('⚠️ Missing Client Environment Variables:', missing);
      return { success: false, missing };
    }
  
    console.log('✅ Client environment variables verified.');
    return { success: true, missing: [] };
  };
  
