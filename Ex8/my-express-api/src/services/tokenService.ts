// services/tokenService.ts
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, config.accessSecret, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, config.refreshSecret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.accessSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.refreshSecret);
};