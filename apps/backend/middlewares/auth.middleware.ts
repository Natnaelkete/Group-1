import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'agromerce_secret';
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
export const protect = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: You do not have the required role' });
      }
      req.user = { id: decoded.id, role: decoded.role };

      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
  };
};
