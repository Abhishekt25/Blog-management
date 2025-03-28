import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).send('Invalid token.');
  }
};
