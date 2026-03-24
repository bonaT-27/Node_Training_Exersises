import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ✅ HEALTH CHECK - MUST COME BEFORE 404 HANDLER
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ❌ 404 handler - MUST BE LAST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
import { Request, Response, NextFunction } from "express";

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health: http://localhost:${PORT}/api/health`);
});

export { app };
