import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export const authMiddleware = async (req: any, res: any, next: any) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            console.log("No token found, redirecting to login.");
            return res.status(401).json({ error: 'Unauthorized - No token' });
        }
        console.log('Token1',token);

        // Verify JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        console.log("Decoded userId from token:", decoded.userId);

        if (!decoded.userId) {
            console.log("Invalid token structure");
            throw new Error('Invalid token structure');
        }

        // Ensure the user exists in DB
        const user = await User.findById(decoded.userId).select('_id profileImage');
        console.log("User found in database:", user);

        if (!user) {
            console.log("User not found in database, clearing token.");
            res.clearCookie('token');
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        // Attach user details to request object
        req.user = {
            userId: user._id.toString(),
           // profileImage: user.profileImage || '/uploads/default-profile.png',
        };
       
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.clearCookie('token');
        // Specific message for expired token
          if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Session expired' });
        }
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
