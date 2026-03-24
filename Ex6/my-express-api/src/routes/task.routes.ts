import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { taskSchema, querySchema } from "../schemas/task.schema.js";

const router = Router();

router.post("/", validate(taskSchema), (req, res) => {
  const { title, priority } = req.validatedBody;
  res.status(201).json({
    success: true,
    message: "Task created",
    data: { title, priority },
  });
});

router.get("/", validate(querySchema), (req, res) => {
  const { page, limit } = req.validatedQuery;
  res.json({
    success: true,
    message: "Tasks retrieved",
    data: [],
    pagination: { page, limit },
  });
});

export default router;
