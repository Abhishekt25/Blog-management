"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'src/public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = (0, multer_1.default)({ storage });
router.get('/', authMiddleware_1.authMiddleware, blogController_1.getAllBlogs);
// View a single blog
router.get("/view/:id", authMiddleware_1.authMiddleware, blogController_1.getBlogDetails);
router.get('/create', authMiddleware_1.authMiddleware, (req, res) => {
    res.render('blogs/addBlog', {
        userId: req.user ? req.user.userId : "Guest",
        profileImage: req.user && req.user.profileImage
            ? `/uploads/${req.user.profileImage}`
            : "/images/default-profile.png",
    });
});
router.get('/edit/:id', authMiddleware_1.authMiddleware, blogController_1.getEditBlog);
router.post('/create', authMiddleware_1.authMiddleware, upload.single('image'), blogController_1.createBlog);
router.post('/update/:id', authMiddleware_1.authMiddleware, upload.single('image'), blogController_1.updateBlog);
router.post('/delete/:id', authMiddleware_1.authMiddleware, blogController_1.deleteBlog);
exports.default = router;
