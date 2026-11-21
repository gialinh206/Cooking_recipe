import { Router } from 'express';
import {
  listRecipesByStatus, setRecipeStatus, listAllReviews, topRated,
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';

const router = Router();
router.use(verifyToken, requireRole('admin')); // toàn bộ /api/admin/* chỉ admin
router.get('/recipes', listRecipesByStatus);
router.patch('/recipes/:id/status', setRecipeStatus);
router.get('/reviews', listAllReviews);
router.get('/stats/top-rated', topRated);
export default router;
