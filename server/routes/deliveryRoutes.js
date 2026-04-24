import express from 'express';
import { 
  getAvailableOrders, 
  acceptOrder, 
  updateDeliveryStatus, 
  confirmDelivery, 
  getDeliveryHistory, 
  getDeliveryEarnings 
} from '../controllers/deliveryController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken); // All delivery routes require authentication

router.get('/available', getAvailableOrders);
router.post('/:orderId/accept', acceptOrder);
router.patch('/:orderId/status', updateDeliveryStatus);
router.post('/:orderId/confirm', confirmDelivery);
router.get('/history', getDeliveryHistory);
router.get('/earnings', getDeliveryEarnings);

export default router;
