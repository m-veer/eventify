import jwt from 'jsonwebtoken';
// import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import { UserRequest } from "../types/express/custom"

// Generalized Authentication Middleware
const authenticate = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  role?: string
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Authorization token required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Check role if required
    if (role && role === 'admin' && !user.isAdmin) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Admin access required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      code: 'INVALID_TOKEN',
      message: 'Invalid or expired token',
    });
  }
};

// Middleware for User Authentication
const auth = (req: Request, res: Response, next: NextFunction) => {
  authenticate(req, res, next); // No role check, default user access
};

// Middleware for Admin Authentication
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  authenticate(req, res, next, 'admin'); // Check for admin role
};

export { auth, adminAuth };
