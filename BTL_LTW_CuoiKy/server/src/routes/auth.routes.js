import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { handleValidation, registerRules, loginRules } from '../middlewares/validate.js';

const router = Router();
router.post('/register', registerRules, handleValidation, register);
router.post('/login', loginRules, handleValidation, login);
router.get('/me', verifyToken, me);
export default router;
