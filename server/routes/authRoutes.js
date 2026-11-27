import { Router } from 'express';
import { register, login, googleLogin, me, getFavorites, toggleFavorite } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/google', googleLogin);
router.get('/auth/me', protect, me);
router.get('/users/me/favorites', protect, getFavorites);
router.post('/users/me/favorites/:recipeId', protect, toggleFavorite);
export default router;
