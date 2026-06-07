import { Router } from 'express';
import {
  getPharmacistStats,
  getPharmacistInventory,
  getLowStockAlerts,
  getPharmacistProfile,
  updatePharmacistProfile,
  getPharmacistEarnings,
  getPharmacistAnalytics
} from '../controllers/pharmacistController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken);
router.use(authorizeRoles(['pharmacist']));

router.get('/stats', getPharmacistStats);
router.get('/profile', getPharmacistProfile);
router.put('/profile', updatePharmacistProfile);
router.get('/inventory', getPharmacistInventory);
router.get('/low-stock', getLowStockAlerts);
router.get('/earnings', getPharmacistEarnings);
router.get('/analytics', getPharmacistAnalytics);

export default router;
