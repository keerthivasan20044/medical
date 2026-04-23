import { Router } from 'express';
import { getAllPharmacies, getPharmacyById, getPharmacyMedicines, createPharmacy, updatePharmacy, getKaraikalPharmacies } from '../controllers/pharmacyController.js';
import { fetchPharmacyPhoto, setMainPhoto, deletePhoto } from '../controllers/pharmacyPhotoController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getAllPharmacies);
router.get('/karaikal', getKaraikalPharmacies);
router.get('/:id/medicines', getPharmacyMedicines);
router.get('/:id', getPharmacyById);
router.post('/', verifyToken, authorizeRoles(['admin']), upload.array('images', 5), createPharmacy);
router.put('/:id', verifyToken, authorizeRoles(['admin', 'pharmacist']), upload.array('images', 5), updatePharmacy);

// Photo management routes
router.post('/:id/fetch-photo', verifyToken, authorizeRoles(['admin', 'pharmacist']), fetchPharmacyPhoto);
router.put('/:id/set-main-photo', verifyToken, authorizeRoles(['admin', 'pharmacist']), setMainPhoto);
router.delete('/:id/photos', verifyToken, authorizeRoles(['admin', 'pharmacist']), deletePhoto);

export default router;

