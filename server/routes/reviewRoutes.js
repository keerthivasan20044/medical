import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getReviews);
router.post('/', verifyToken, createReview);

export default router;
