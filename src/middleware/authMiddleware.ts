import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user'; 

dotenv.config();

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies?.token; 
    if (!token) {
      console.log("No token found, redirecting to login.");
      return res.redirect('/login'); 
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    if (!decoded.userId) {
      console.log("Decoded token structure invalid:", decoded);
      throw new Error('Invalid token structure'); 
    }

    // Fetch user details (including profileImage) from the database
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'profileImage'],
    });

    if (!user) {
      console.log("User not found in database, clearing token.");
      res.clearCookie('token'); 
      return res.redirect('/login');
    }

    // console.log("User found:", user.id, "Profile Image:", user.profileImage);

    // Attach user details to `req.user`
    req.user = {
      userId: user.id,
      profileImage: user.profileImage || '/uploads/default-profile.png',
    };

    // console.log("Middleware set req.user:", req.user);

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.clearCookie('token'); 
    return res.redirect('/login');
  }
};
