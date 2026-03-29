// src/config/env.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  accessSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET as string,
  nodeEnv: process.env.NODE_ENV || 'development'
};