import express from 'express';
import { signup, login, logoutUser, dashboard, updateProfile ,upload} from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
// Protected routes (require auth middleware)
router.get('/', authMiddleware, dashboard); 

// Public routes (no auth middleware)
router.post('/signup', signup);
router.post('/signin', login);
router.post('/logout',logoutUser)

// router.put('/update', authMiddleware, updateProfile);
router.put('/update', authMiddleware, upload.single('profileImage'), updateProfile);

export default router;