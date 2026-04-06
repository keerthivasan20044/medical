import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createPaymentIntent, confirmPayment, getReceipt, getReceipts, getReceiptsCsv, razorpayWebhook, logPaymentRetry } from '../controllers/paymentController.js';

const router = Router();

router.post('/intent', verifyToken, createPaymentIntent);
router.post('/confirm', verifyToken, confirmPayment);
router.get('/receipt/:id', verifyToken, getReceipt);
router.get('/receipts', verifyToken, getReceipts);
router.get('/receipts.csv', verifyToken, getReceiptsCsv);
router.post('/retry', verifyToken, logPaymentRetry);
router.post('/webhook/razorpay', razorpayWebhook);

export default router;
