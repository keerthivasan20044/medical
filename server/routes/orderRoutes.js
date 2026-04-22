import { Router } from 'express';
import { 
  placeOrder, getMyOrders, getPharmacyOrders, getOrderById, updateOrderStatus, 
  verifyDeliveryOTP, liveTrackOrder, rateOrder 
} from '../controllers/orderController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, placeOrder);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/pharmacy', verifyToken, authorizeRoles(['pharmacist', 'admin']), getPharmacyOrders);
router.get('/:id', verifyToken, getOrderById);
router.patch('/:id/status', verifyToken, updateOrderStatus);
router.post('/:id/verify-otp', verifyToken, verifyDeliveryOTP);
router.get('/:id/track', verifyToken, liveTrackOrder);
router.post('/:id/rate', verifyToken, rateOrder);

export default router;
