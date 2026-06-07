import express from 'express';
import { 
  getAvailableOrders,
  getActiveOrder,
  acceptOrder, 
  updateDeliveryStatus, 
  updateDeliveryLocation,
  confirmDelivery, 
  resendDeliveryOtp,
  reportDisruption,
  getDeliveryHistory, 
  getDeliveryEarnings 
} from '../controllers/deliveryController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken); // All delivery routes require authentication
router.use(authorizeRoles(['delivery', 'admin']));

router.get('/available', getAvailableOrders);
router.get('/active', getActiveOrder);
router.post('/:orderId/accept', acceptOrder);
router.patch('/:orderId/status', updateDeliveryStatus);
router.patch('/:orderId/location', updateDeliveryLocation);
router.post('/:orderId/confirm', confirmDelivery);
router.post('/:orderId/resend-otp', resendDeliveryOtp);
router.post('/:orderId/report-disruption', reportDisruption);
router.get('/history', getDeliveryHistory);
router.get('/earnings', getDeliveryEarnings);

export default router;
