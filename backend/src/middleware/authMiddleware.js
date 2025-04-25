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
            return res.status(401).json({ error: 'Unauthorized - No token' });
        }
        console.log('Token1', token);
        // Verify JWT Token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded userId from token:", decoded.userId);
        if (!decoded.userId) {
            console.log("Invalid token structure");
            throw new Error('Invalid token structure');
        }
        // Ensure the user exists in DB
        const user = yield user_1.default.findById(decoded.userId).select('_id profileImage');
        console.log("User found in database:", user);
        if (!user) {
            console.log("User not found in database, clearing token.");
            res.clearCookie('token');
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }
        // Attach user details to request object
        req.user = {
            userId: user._id.toString(),
            // profileImage: user.profileImage || '/uploads/default-profile.png',
        };
        next();
    }
    catch (err) {
        console.error('Auth Middleware Error:', err);
        res.clearCookie('token');
        // Specific message for expired token
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ error: 'Session expired' });
        }
        return res.status(401).json({ error: 'Unauthorized' });
    }
});
exports.authMiddleware = authMiddleware;
