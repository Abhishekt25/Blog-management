"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = exports.login = exports.signup = exports.upload = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
// ✅ Define the correct uploads directory
const uploadsDir = path_1.default.join(__dirname, '../public/uploads');
;
// ✅ Ensure the uploads directory exists
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// ✅ Configure Multer storage with the correct destination
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // ✅ Ensures files are saved in `src/public/uploads/`
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // ✅ Unique filename
    }
});
exports.upload = (0, multer_1.default)({ storage });
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;
    try {
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).render('signup', { error: 'Email already in use' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create a new user
        yield user_1.default.create({ email, password: hashedPassword, profileImage });
        res.redirect('/login');
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).render('signup', { error: 'Error creating user' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('login', { error: 'Email and password are required' });
    }
    try {
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).render('login', { error: 'User not found' });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).render('login', { error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.redirect('/');
    }
    catch (err) {
        console.error('Error login:', err);
        res.status(500).render('login', { error: 'Server error' });
    }
});
exports.login = login;
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).send('Unauthorized: No user data found.');
        }
        const userId = req.user.userId;
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('dashboard', {
            userId: user.id, // Pass userId explicitly
            username: user.email,
            profileImage: user.profileImage ? `/uploads/${user.profileImage}` : '/images/default-profile.png',
        });
    }
    catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Server error.');
    }
});
exports.dashboard = dashboard;
