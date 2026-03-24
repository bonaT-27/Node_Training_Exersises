import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

// route
app.use("/api/users", userRoutes);

// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
