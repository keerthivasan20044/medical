import { Router } from 'express';
import { 
  uploadPrescription, 
  getMyPrescriptions, 
  getPrescriptionById, 
  getPharmacyQueue,
  approvePrescription, 
  rejectPrescription,
  deletePrescription
} from '../controllers/prescriptionController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Customer routes
router.post('/', verifyToken, upload.single('image'), uploadPrescription);
router.get('/me', verifyToken, getMyPrescriptions);
router.get('/pharmacy', verifyToken, authorizeRoles(['pharmacist', 'admin']), getPharmacyQueue);
router.get('/:id', verifyToken, getPrescriptionById);
router.delete('/:id', verifyToken, deletePrescription);

// Pharmacist routes
router.put('/:id/approve', verifyToken, authorizeRoles(['pharmacist', 'admin']), approvePrescription);
router.put('/:id/reject', verifyToken, authorizeRoles(['pharmacist', 'admin']), rejectPrescription);

export default router;
