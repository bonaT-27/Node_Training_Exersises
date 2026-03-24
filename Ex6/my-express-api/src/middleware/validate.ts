import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.validatedBody = validated.body;
      req.validatedQuery = validated.query;
      req.validatedParams = validated.params;

      next();
    } catch (error: any) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
  };
};
