// src/middleware/logger.ts

import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  console.log(`📥 ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusColor} ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};