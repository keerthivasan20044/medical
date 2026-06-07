import { Router } from 'express';
import { 
  placeOrder, getMyOrders, getPharmacyOrders, getOrderById, updateOrderStatus, 
  cancelMyOrder, verifyDeliveryOTP, liveTrackOrder, rateOrder 
} from '../controllers/orderController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, placeOrder);
router.get('/', verifyToken, authorizeRoles(['admin', 'pharmacist']), getPharmacyOrders);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/pharmacy', verifyToken, authorizeRoles(['pharmacist', 'admin']), getPharmacyOrders);
router.get('/:id', verifyToken, getOrderById);
router.patch('/:id/status', verifyToken, authorizeRoles(['admin', 'pharmacist']), updateOrderStatus);
router.patch('/:id/cancel', verifyToken, cancelMyOrder);
router.put('/:id/verify-otp', verifyToken, authorizeRoles(['delivery', 'admin']), verifyDeliveryOTP);
router.post('/:id/verify-otp', verifyToken, authorizeRoles(['delivery', 'admin']), verifyDeliveryOTP);
router.get('/:id/track', verifyToken, liveTrackOrder);
router.post('/:id/rate', verifyToken, rateOrder);

export default router;
