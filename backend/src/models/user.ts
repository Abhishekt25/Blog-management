// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/db';

// class User extends Model {
//   public id!: number;
//   public email!: string;
//   public password!: string;
//   public profileImage?: string;
// }

// User.init({
//     id: {
//         type: DataTypes.INTEGER,  
//         autoIncrement: true,       
//         primaryKey: true,         
//         allowNull: false,         
//       },
//   email: { 
//     type: DataTypes.STRING, 
//     allowNull: false 
//   },
//   password: { 
//     type: DataTypes.STRING, 
//     allowNull: false
//  },
//  profileImage: {
//     type: DataTypes.STRING, 
//     allowNull: true,       
//   },
// }, {
//   sequelize,
//   tableName: 'user',
//   timestamps: false,
// });

// export default User;

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; 
  name:string;
  email: string;
  password: string;
  phoneNumber?: string;  // Changed from number to string
  dateOfBirth?: Date;    // Changed from number to Date
  profileImage?: string;
}

const UserSchema = new Schema<IUser>({
  // id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated ID
  name:{type:String, required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },  
  dateOfBirth: { type: Date }, 
  profileImage: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);

