// src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Attach validated data to request
      (req as any).validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        
      } else {
        next(error);
      }
    }
  };
};

// Validation schemas for common operations
import { z } from 'zod';

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    age: z.number().int().min(0).max(150).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    age: z.number().int().min(0).max(150).optional(),
  }),
});