import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const uploadsDir = path.join(__dirname, '../public/uploads');;


if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

export const upload = multer({ storage });
  

export const signup = async (req: any, res:any) =>{

      const {email, password} = req.body;
      const profileImage = req.file ? req.file.filename : null; 

      try{
        const existingUser = await User.findOne({ where: {email}});
         if (existingUser) {
         return res.status(400).render('signup', { error: 'Email already in use' });
        }

      // Hash password
      const hashedPassword = await bcrypt.hash(password,10);

       // Create a new user
       await User.create({ email, password: hashedPassword, profileImage });
       res.redirect('/login');

      }catch(err){
        console.error('Error creating user:', err);
        res.status(500).render('signup',{error: 'Error creating user'});
      }

}

export const login = async (req: any, res: any) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render('login', { error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).render('login', { error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).render('login', { error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.redirect('/');
    } catch (err) {
        console.error('Error login:', err);
        res.status(500).render('login', { error: 'Server error' });
    }
};


export const dashboard = async (req: any, res: any) => {
    try {
        if (!req.user || !req.user.userId) { 
            return res.status(401).send('Unauthorized: No user data found.');
        }

        const userId = req.user.userId; 
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('dashboard', {
            userId: user.id, // Pass userId explicitly
            username: user.email,
            profileImage: user.profileImage ? `/uploads/${user.profileImage}` : '/images/default-profile.png',
        });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Server error.');
    }
};

export const logoutUser = async (req: any, res: any) => {
  try {
      res.clearCookie("token"); 
      res.redirect("/login"); 
  } catch (err) {
      console.error("Error during logout:", err);
      res.status(500).send("Error logging out.");
  }
};
