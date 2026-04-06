import { Router } from 'express';
import { getAllPharmacies, getPharmacyById, getPharmacyMedicines, createPharmacy, updatePharmacy, getKaraikalPharmacies } from '../controllers/pharmacyController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllPharmacies);
router.get('/karaikal', getKaraikalPharmacies);
router.get('/:id/medicines', getPharmacyMedicines);
router.get('/:id', getPharmacyById);
router.post('/', verifyToken, authorizeRoles(['admin']), createPharmacy);
router.put('/:id', verifyToken, authorizeRoles(['admin', 'pharmacist']), updatePharmacy);

export default router;
