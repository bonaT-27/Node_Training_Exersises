import { Request, Response } from 'express';
import { getUser, getUsers } from '../services/userService.js';

export const fetchUsers = (req: Request, res: Response) => {
  const users = getUsers();
  res.json(users);
};

export const fetchUserById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = getUser(id);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};