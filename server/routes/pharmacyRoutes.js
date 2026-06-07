import express from 'express';
import { 
  getPharmacies, 
  getNearbyPharmacies, 
  getPharmacyById, 
  getPharmacyMedicines, 
  addPharmacyReview,
  createPharmacy,
  updatePharmacy,
  deletePharmacy
} from '../controllers/pharmacyController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPharmacies);
router.get('/nearby', getNearbyPharmacies);
router.get('/admin/list', verifyToken, authorizeRoles(['admin']), getPharmacies);
router.get('/:id', getPharmacyById);
router.get('/:id/medicines', getPharmacyMedicines);

// Protected routes
router.post('/', verifyToken, authorizeRoles(['admin']), createPharmacy);
router.put('/:id', verifyToken, authorizeRoles(['admin']), updatePharmacy);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), deletePharmacy);
router.post('/:id/reviews', verifyToken, addPharmacyReview);

export default router;
