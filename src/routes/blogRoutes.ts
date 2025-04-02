import express from 'express';
import { createBlog, getAllBlogs, getEditBlog, updateBlog, deleteBlog , getBlogDetails} from '../controllers/blogController';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


router.get('/', authMiddleware, getAllBlogs);

// View a single blog
router.get("/view/:id", authMiddleware, getBlogDetails);

router.get('/create', authMiddleware, (req, res) => {
  res.render('blogs/addBlog', { 
    userId: req.user ? req.user.userId : "Guest",
    profileImage: req.user && req.user.profileImage 
      ? `/uploads/${req.user.profileImage}` 
      : "/images/default-profile.png",
  });
});
router.get('/edit/:id', authMiddleware, getEditBlog);
router.post('/create', authMiddleware, upload.single('image'), createBlog);
router.post('/update/:id', authMiddleware, upload.single('image'), updateBlog);
router.post('/delete/:id', authMiddleware, deleteBlog);

export default router;
