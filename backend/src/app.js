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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
// import sequelize from '../src/config/db';
const authRoutes_1 = __importDefault(require("../src/routes/authRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 2507;
// view engine 
// app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'views'));
//middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/uploads', express_1.default.static('public/uploads'));
//Allow frontend to access api
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((0, cookie_parser_1.default)());
app.post('/api/logout', (req, res) => {
    try {
        res.clearCookie("token"); // Clear the authentication cookie
        res.status(200).json({ message: "Logout successful" });
    }
    catch (err) {
        console.error("Error during logout:", err);
        res.status(500).json({ error: "Error logging out." });
    }
});
// app.use((req: any, res: any, next: any) => {
//   res.locals.userId = req.userId ? req.userId : null;
//   res.locals.profileImage = req.user ? req.user.profileImage : '/images/default-profile.jpg';
//   next();
// });
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, "public")));
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
//Routes
app.use('/api', authRoutes_1.default);
app.use('/blogs', blogRoutes_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await sequelize.authenticate();
        yield (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
startServer();
