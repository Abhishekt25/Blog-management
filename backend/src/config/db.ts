// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

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

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/abt";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "abt" // Specify the database name directly
    });
    console.log(" MongoDB connected successfully!");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectMongoDB