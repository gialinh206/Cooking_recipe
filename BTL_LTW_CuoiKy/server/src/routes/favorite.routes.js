import { Router } from 'express';
import { listFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();
router.use(verifyToken);
router.get('/', listFavorites);
router.post('/:recipeId', addFavorite);
router.delete('/:recipeId', removeFavorite);
export default router;
