"use strict";
// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/db';
// import User from './user'; 
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// class Blog extends Model {
//   public id!: number;
//   public title!: string;
//   public description!: string;
//   public image!: string;
//   public userId!: number;
// }
// Blog.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     image: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: User, 
//         key: 'id',
//       },
//       onDelete: 'CASCADE',
//     },
//   },
//   { sequelize, modelName: 'blog' }
// );
// User.hasMany(Blog, { foreignKey: 'userId' });
// Blog.belongsTo(User, { foreignKey: 'userId' });
// export default Blog;
// models/Blog.ts
const mongoose_1 = __importStar(require("mongoose"));
const BlogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to User collection
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});
const Blog = mongoose_1.default.model('Blog', BlogSchema);
exports.default = Blog;
