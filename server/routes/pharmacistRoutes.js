import { Router } from 'express';
import { getPharmacistStats, getPharmacistInventory, getLowStockAlerts } from '../controllers/pharmacistController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken);
router.use(authorizeRoles(['pharmacist']));

router.get('/stats', getPharmacistStats);
router.get('/inventory', getPharmacistInventory);
router.get('/low-stock', getLowStockAlerts);

export default router;

