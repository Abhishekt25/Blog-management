import express from 'express';
import { signup, login,logoutUser, dashboard ,upload } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';


const router= express.Router();

// GET routes for rendering signup and login views
router.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  router.get('/login', (req, res) => {
    res.render('login');
  });
  router.get("/logout", logoutUser);
  router.get('/', authMiddleware, dashboard);

// POST routes for handling signup and login logic
router.post('/signup', upload.single('profileImage'), signup); 
router.post('/login', login);
router.post('/', dashboard);
export default router;