import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sequelize from '../src/config/db';
import authRoutes from '../src/routes/authRoutes';
import blogRoutes from './routes/blogRoutes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 2507;

// parsing request bodies
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());



// view engine 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use((req: any, res: any, next: any) => {
  res.locals.userId = req.userId ? req.userId : null;
  res.locals.profileImage = req.user ? req.user.profileImage : '/images/default-profile.jpg';
  next();
});
app.use(express.static("public"));

app.use('/', authRoutes);
app.use('/blogs', blogRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
   // console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
