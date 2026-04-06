import { Router } from 'express';
import { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine, getMedicinesByCategory, getSearchSuggestions } from '../controllers/medicineController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllMedicines);
router.get('/suggestions', getSearchSuggestions);
router.get('/category/:cat', getMedicinesByCategory);
router.get('/:id', getMedicineById);
router.post('/', verifyToken, authorizeRoles(['pharmacist', 'admin']), createMedicine);
router.put('/:id', verifyToken, authorizeRoles(['pharmacist', 'admin']), updateMedicine);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), deleteMedicine);

export default router;
