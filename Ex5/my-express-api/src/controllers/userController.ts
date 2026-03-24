import { Request, Response } from "express";
import { userService } from '../services/userService.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Read query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const name = req.query.name as string;

    // Call service
    const result = await userService.getUsers({ page, limit, name });

    // Send response
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};