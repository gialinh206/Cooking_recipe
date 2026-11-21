import { Router } from 'express';
import {
  listCategories, createCategory, updateCategory, deleteCategory,
} from '../controllers/category.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';
import { handleValidation, categoryRules } from '../middlewares/validate.js';

const router = Router();
router.get('/', listCategories);
router.post('/', verifyToken, requireRole('admin'), categoryRules, handleValidation, createCategory);
router.put('/:id', verifyToken, requireRole('admin'), categoryRules, handleValidation, updateCategory);
router.delete('/:id', verifyToken, requireRole('admin'), deleteCategory);
export default router;
