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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            console.log("No token found, redirecting to login.");
            return res.redirect('/login');
        }
        // Verify JWT Token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            console.log("Decoded token structure invalid:", decoded);
            throw new Error('Invalid token structure');
        }
        // Fetch user details (including profileImage) from the database
        const user = yield user_1.default.findByPk(decoded.userId, {
            attributes: ['id', 'profileImage'],
        });
        if (!user) {
            console.log("User not found in database, clearing token.");
            res.clearCookie('token');
            return res.redirect('/login');
        }
        // console.log("User found:", user.id, "Profile Image:", user.profileImage);
        // Attach user details to `req.user`
        req.user = {
            userId: user.id,
            profileImage: user.profileImage || '/uploads/default-profile.png',
        };
        // console.log("Middleware set req.user:", req.user);
        next();
    }
    catch (err) {
        console.error('Auth Middleware Error:', err);
        res.clearCookie('token');
        return res.redirect('/login');
    }
});
exports.authMiddleware = authMiddleware;
