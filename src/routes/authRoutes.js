"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// GET routes for rendering signup and login views
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get("/logout", authController_1.logoutUser);
router.get('/', authMiddleware_1.authMiddleware, authController_1.dashboard);
// POST routes for handling signup and login logic
router.post('/signup', authController_1.upload.single('profileImage'), authController_1.signup);
router.post('/login', authController_1.login);
router.post('/', authController_1.dashboard);
exports.default = router;
