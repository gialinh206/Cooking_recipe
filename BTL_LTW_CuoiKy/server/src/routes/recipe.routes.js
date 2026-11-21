import { Router } from 'express';
import {
  listRecipes, searchByIngredients, myRecipes, getRecipe,
  createRecipe, updateRecipe, deleteRecipe,
} from '../controllers/recipe.controller.js';
import { listReviews, createReview } from '../controllers/review.controller.js';
import { verifyToken, optionalAuth } from '../middlewares/auth.js';
import { isRecipeOwner } from '../middlewares/ownership.js';
import upload from '../middlewares/upload.js';
import { parseRecipeBody } from '../middlewares/parseRecipeBody.js';
import { handleValidation, recipeRules, reviewRules } from '../middlewares/validate.js';

const router = Router();

router.get('/', listRecipes);
router.get('/search-by-ingredients', searchByIngredients); // phải đặt trước '/:id'
router.get('/mine', verifyToken, myRecipes);               // phải đặt trước '/:id'
router.get('/:id', optionalAuth, getRecipe);

router.post('/', verifyToken, upload.single('image'), parseRecipeBody, recipeRules, handleValidation, createRecipe);
router.put('/:id', verifyToken, isRecipeOwner, upload.single('image'), parseRecipeBody, recipeRules, handleValidation, updateRecipe);
router.delete('/:id', verifyToken, isRecipeOwner, deleteRecipe);

router.get('/:id/reviews', listReviews);
router.post('/:id/reviews', verifyToken, reviewRules, handleValidation, createReview);

export default router;
