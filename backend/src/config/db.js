"use strict";
// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";
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
// dotenv.config();
// const sequelize = new Sequelize (
//     process.env.DB_NAME!,
//     process.env.DB_USER!,
//     process.env.DB_PASS!,
//     {
//         host: process.env.DB_HOST,
//         dialect: "mysql",
//         logging: false,
//     }
// );
// export default sequelize;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/abt";
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URI, {
            dbName: "abt" // Specify the database name directly
        });
        console.log(" MongoDB connected successfully!");
    }
    catch (error) {
        console.error(" MongoDB connection error:", error);
        process.exit(1); // Exit process if connection fails
    }
});
exports.default = connectMongoDB;
