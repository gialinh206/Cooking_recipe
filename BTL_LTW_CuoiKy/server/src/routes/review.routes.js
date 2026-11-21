import { Router } from 'express';
import { toggleHideReview } from '../controllers/review.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';

const router = Router();
router.patch('/:id/hide', verifyToken, requireRole('admin'), toggleHideReview);
export default router;
