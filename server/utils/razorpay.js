import Razorpay from 'razorpay';
import config from '../config/config.js';

/**
 * Razorpay Payment Enclave
 * Handles secure financial handshakes in TEST mode.
 */
export const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

export default razorpay;
