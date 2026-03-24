import { z } from "zod";

export const registerSchema = z
  .object({
    body: z.object({
      name: z.string().min(2, "Name too short"),
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Password too short"),
      confirmPassword: z.string(),
    }),
  })
  .refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords don't match",
    path: ["body", "confirmPassword"],
  });

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});
