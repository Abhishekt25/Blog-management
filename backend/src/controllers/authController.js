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
exports.logoutUser = exports.updateProfile = exports.dashboard = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }
    const { name, email, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            // return res.status(400).render('signup', { error: 'Email already in use' });
            return res.status(400).json({ error: 'Email already in use' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = new user_1.default({
            name,
            email,
            password: hashedPassword,
            // profileImage,
        });
        yield newUser.save();
        // res.redirect('/signin');
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (err) {
        console.error('Error creating user:', err.message || err);
        // res.status(500).render('signup', { error: 'Error creating user' });
        res.status(500).json({ error: 'Error creating user' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Received Login Request:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        console.log('Token:', token);
        // Set token in cookie (optional)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3600000, // 1 hour
        });
        // Send the response once — only here
        return res.status(200).json({ message: "Login successful", token });
    }
    catch (err) {
        console.error("Error login:", err.message || err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.login = login;
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).send('Unauthorized: No user data found.');
        }
        const userId = req.user.userId;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        // console.log("User found:", user); // Debugging log
        res.json({
            user: {
                userId: user._id.toString(),
                name: user.name,
                email: user.email || "User",
                phoneNumber: user.phoneNumber || "",
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : "",
                profileImage: user.profileImage ? `/uploads/${user.profileImage}` : '/images/default-profile.png',
            }
        });
    }
    catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Server error.');
    }
});
exports.dashboard = dashboard;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { phoneNumber, dateOfBirth } = req.body;
        const updatedUser = yield user_1.default.findByIdAndUpdate(req.user.userId, {
            $set: {
                phoneNumber,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
            }
        }, { new: true, runValidators: true } // Added runValidators
        ).select('name email phoneNumber dateOfBirth profileImage');
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({
            user: updatedUser // Simplified response
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateProfile = updateProfile;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.redirect("/login");
    }
    catch (err) {
        console.error("Error during logout:", err);
        res.status(500).send("Error logging out.");
    }
});
exports.logoutUser = logoutUser;
