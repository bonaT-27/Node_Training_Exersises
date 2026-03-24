import { Router } from "express";
import authRoutes from "./auth.routes.js";
import taskRoutes from "./task.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default router;
