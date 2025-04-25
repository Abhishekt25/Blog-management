// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/db';
// import User from './user'; 

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
import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  description: string;
  image?: string;
  userId: mongoose.Types.ObjectId; // Reference to User
}

const BlogSchema: Schema = new Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User collection
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;


