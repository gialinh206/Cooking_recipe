import { Router } from 'express';
import auth from './auth.routes.js';
import recipes from './recipe.routes.js';
import reviews from './review.routes.js';
import favorites from './favorite.routes.js';
import mealplans from './mealplan.routes.js';
import categories from './category.routes.js';
import admin from './admin.routes.js';

const router = Router();
router.use('/auth', auth);
router.use('/recipes', recipes);
router.use('/reviews', reviews);
router.use('/favorites', favorites);
router.use('/mealplans', mealplans);
router.use('/categories', categories);
router.use('/admin', admin);
export default router;
