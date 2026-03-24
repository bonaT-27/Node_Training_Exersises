import { z } from "zod";

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title required"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
  }),
});

export const querySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});
