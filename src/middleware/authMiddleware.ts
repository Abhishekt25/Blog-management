import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {NextFunction } from 'express';

dotenv.config();

export const authMiddleware = (req: any, res: any, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login'); // Redirect to login if no token is found
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.clearCookie('token'); // Clear invalid token
    return res.redirect('/login'); // Redirect to login if token is invalid
  }
};

