// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/tokenService.js';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};