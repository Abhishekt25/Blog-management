import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public profileImage?: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,  
        autoIncrement: true,       
        primaryKey: true,         
        allowNull: false,         
      },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false
 },
 profileImage: {
    type: DataTypes.STRING, 
    allowNull: true,       
  },
}, {
  sequelize,
  tableName: 'user',
  timestamps: false,
});

export default User;