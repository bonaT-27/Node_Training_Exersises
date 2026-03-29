// controllers/authController.ts
import { Request, Response } from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../services/tokenService.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

// Fake DB
const users: any[] = [];
let refreshTokens: string[] = [];

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashed = await hashPassword(password);

  const user = {
    id: users.length + 1,
    email,
    password: hashed,
    role: 'user'
  };

  users.push(user);

  res.status(201).json(user);
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isValid = await comparePassword(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { userId: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

// REFRESH TOKEN (Rotation)
export const refresh = (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token || !refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  try {
    const payload = verifyRefreshToken(token) as any;

    // Remove old token (rotation)
    refreshTokens = refreshTokens.filter(t => t !== token);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      role: payload.role
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      role: payload.role
    });

    refreshTokens.push(newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch {
    res.sendStatus(403);
  }
};

// LOGOUT
export const logout = (req: Request, res: Response) => {
  const { token } = req.body;

  refreshTokens = refreshTokens.filter(t => t !== token);

  res.sendStatus(204);
};