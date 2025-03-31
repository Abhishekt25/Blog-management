import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import User from './user'; 

class Blog extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public image!: string;
  public userId!: number;
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, 
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  { sequelize, modelName: 'blog' }
);

User.hasMany(Blog, { foreignKey: 'userId' });
Blog.belongsTo(User, { foreignKey: 'userId' });

export default Blog;
