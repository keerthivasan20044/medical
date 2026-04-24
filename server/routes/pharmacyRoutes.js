import express from 'express';
import { 
  getPharmacies, 
  getNearbyPharmacies, 
  getPharmacyById, 
  getPharmacyMedicines, 
  addPharmacyReview 
} from '../controllers/pharmacyController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPharmacies);
router.get('/nearby', getNearbyPharmacies);
router.get('/:id', getPharmacyById);
router.get('/:id/medicines', getPharmacyMedicines);

// Protected routes
router.post('/:id/reviews', verifyToken, addPharmacyReview);

export default router;
