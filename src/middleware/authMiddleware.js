"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => {
    var _a;
    console.log("Middlewaresss user:", req.user);
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return res.redirect('/login'); // Redirect to login if no token is found
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error('Token verification failed:', err);
        res.clearCookie('token'); // Clear invalid token
        return res.redirect('/login'); // Redirect to login if token is invalid
    }
};
exports.authMiddleware = authMiddleware;
const authenticateUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect("/login");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.clearCookie("jwt");
        return res.redirect("/login");
    }
};
exports.authenticateUser = authenticateUser;
