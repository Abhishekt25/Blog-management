"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Protected routes (require auth middleware)
router.get('/', authMiddleware_1.authMiddleware, authController_1.dashboard);
// Public routes (no auth middleware)
router.post('/signup', authController_1.signup);
router.post('/signin', authController_1.login);
router.post('/logout', authController_1.logoutUser);
// router.put('/update', authMiddleware, updateProfile);
router.put('/update', authMiddleware_1.authMiddleware, authController_1.upload.single('profileImage'), authController_1.updateProfile);
exports.default = router;
