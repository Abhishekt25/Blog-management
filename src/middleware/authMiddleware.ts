import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../models/user"; // Import your User model
dotenv.config();




export const authMiddleware = (req: any, res: any, next: any) => {
  console.log("Middlewaresss user:", req.user);
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
export const authenticateUser = (req: any, res: any, next: any) => {
  const token = req.cookies.jwt;

  if (!token) {
      return res.redirect("/login"); 
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (req as any).user = decoded;
      next();
  } catch (err) {
      res.clearCookie("jwt");
      return res.redirect("/login");
  }
};

