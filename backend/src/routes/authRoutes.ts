import express from 'express';
import { signup, login, logoutUser, dashboard, updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { Router } from 'express';

const router = express.Router();
// Protected routes (require auth middleware)
router.get('/', authMiddleware, dashboard); 

// Public routes (no auth middleware)
router.post('/signup', signup);
router.post('/signin', login);

router.put('/update', authMiddleware, updateProfile);


export default router;