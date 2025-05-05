import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// import sequelize from '../src/config/db';
import authRoutes from '../src/routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import connectMongoDB from './config/db';
import cors from "cors";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 2507;

// view engine 
// app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static('public/uploads'));

//Allow frontend to access api
app.use(cors({
  origin:"http://localhost:5173",
  methods:"GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());

// app.use((req: any, res: any, next: any) => {
//   res.locals.userId = req.userId ? req.userId : null;
//   res.locals.profileImage = req.user ? req.user.profileImage : '/images/default-profile.jpg';
//   next();
// });

// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, "public")));
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


//Routes
app.use('/api', authRoutes);
app.use('/blogs', blogRoutes);

const startServer = async () => {
  try {
   // await sequelize.authenticate();
   await connectMongoDB(); 
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
