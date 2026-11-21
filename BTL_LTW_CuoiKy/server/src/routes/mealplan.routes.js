import { Router } from 'express';
import { getMealPlan, saveMealPlan, shoppingList } from '../controllers/mealplan.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { handleValidation, mealPlanRules } from '../middlewares/validate.js';

const router = Router();
router.use(verifyToken);
router.get('/', getMealPlan);
router.put('/', mealPlanRules, handleValidation, saveMealPlan);
router.get('/shopping-list', shoppingList);
export default router;
