import { TaskService } from "../services/task.service.js";

const taskService = new TaskService();

export const taskController = {
  async getAll(req, res, next) {
    try {
      const result = await taskService.findAll(req.user.id, req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const task = await taskService.findById(req.params.id, req.user.id);
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const task = await taskService.create(req.user.id, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const task = await taskService.update(
        req.params.id,
        req.user.id,
        req.body,
      );
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await taskService.delete(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
