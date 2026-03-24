import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), (req, res) => {
  const { name, email } = req.validatedBody;
  res.status(201).json({
    success: true,
    message: "User registered",
    data: { name, email },
  });
});

router.post("/login", validate(loginSchema), (req, res) => {
  const { email } = req.validatedBody;
  res.json({
    success: true,
    message: "Login successful",
    data: { email },
  });
});

export default router;
