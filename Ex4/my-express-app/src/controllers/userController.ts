// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// In-memory database
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, createdAt: new Date(), updatedAt: new Date() }
];
let nextId = 3;

export const userController = {
  // GET /api/users - Get all users
  getAll: (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const start = (page - 1) * limit;
    const paginatedUsers = users.slice(start, start + limit);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit)
      },
      timestamp: new Date().toISOString()
    });
  },
  
  // GET /api/users/:id - Get user by ID
  getById: (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });
  },
  
  // POST /api/users - Create user
  create: (req: Request, res: Response, next: NextFunction) => {
    const { name, email, age } = req.body as CreateUserRequest;
    
    // Validation
    if (!name || !email) {
      return next(new AppError('Name and email are required', 400));
    }
    
    // Check if email exists
    if (users.find(u => u.email === email)) {
      return next(new AppError('Email already exists', 409));
    }
    
    const newUser: User = {
      id: nextId++,
      name,
      email,
      age,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser,
      timestamp: new Date().toISOString()
    });
  },
  
  // PUT /api/users/:id - Update user
  update: (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const updates = req.body as UpdateUserRequest;
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return next(new AppError('User not found', 404));
    }
    
    // Check email uniqueness
    if (updates.email && updates.email !== users[userIndex].email) {
      if (users.find(u => u.email === updates.email)) {
        return next(new AppError('Email already exists', 409));
      }
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      data: users[userIndex],
      timestamp: new Date().toISOString()
    });
  },
  
  // DELETE /api/users/:id - Delete user
  delete: (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return next(new AppError('User not found', 404));
    }
    
    users.splice(userIndex, 1);
    
    res.status(204).send();
  }
};