import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create directory if it doesn't exist
    const uploadPath = path.join(__dirname, '../../public/uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// const upload = multer({ storage });
  

export const signup = async (req: any, res: any) => {

  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }
  const { name,email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return res.status(400).render('signup', { error: 'Email already in use' });
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
     // profileImage,
    });

    await newUser.save();

    // res.redirect('/signin');
    return res.status(201).json({ message: 'User created successfully' })
  } catch (err : any) {
    console.error('Error creating user:', err.message || err);
    // res.status(500).render('signup', { error: 'Error creating user' });
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const login = async (req: any, res: any) => {
  // console.log('Received Login Request:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, { expiresIn: "1h" });
    console.log('Token:',token)
    // Set token in cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    // Send the response once — only here
    return res.status(200).json({ message: "Login successful", token });

  } catch (err: any) {
    console.error("Error login:", err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const dashboard = async (req: any, res: any) => {
  try {
      if (!req.user || !req.user.userId) { 
          return res.status(401).send('Unauthorized: No user data found.');
      }

      const userId = req.user.userId; 
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }

      // console.log("User found:", user); // Debugging log
      res.json({
        user: {
          userId: user._id.toString(),
          name: user.name,
          email: user.email || "User",
          phoneNumber: user.phoneNumber || "",
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : "",
          profileImage: user.profileImage ? `/uploads/${user.profileImage}` : '/images/default-profile.png',
        }
      });
      

  } catch (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send('Server error.');
  }
};

export const updateProfile = async (req: any, res: any) => {
  try {
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);

    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateFields: any = {
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined
    };

    // Handle file upload
    if (req.file) {
      console.log('Processing new profile image:', req.file);
      
      // Delete old image if exists
      try {
        const user = await User.findById(req.user.userId);
        if (user?.profileImage) {
          const oldImagePath = path.join(__dirname, '../../public/uploads', user.profileImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      } catch (fileError) {
        console.error('Error handling old image:', fileError);
      }

      updateFields.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ 
      user: {
        ...updatedUser.toObject(),
        profileImage: updatedUser.profileImage 
          ? `/uploads/${updatedUser.profileImage}`
          : '/images/default-profile.png'
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      
    });
  }
};



export const logoutUser = async (req: any, res: any) => {
  try {
      res.clearCookie("token"); 
      res.status(200).json({ message: "Logout successful" });
  } catch (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ error: "Error logging out." });
  }
};
