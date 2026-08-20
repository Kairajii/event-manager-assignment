import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { CustomError } from "../utils";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const serverError = (
  err: CustomError | ZodError | (Error & { code?: string }),
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
    return;
  }

  // Common Postgres error codes mapped to meaningful HTTP responses
  if ("code" in err && typeof err.code === "string") {
    if (err.code === "23505") {
      res.status(409).json({ success: false, message: "A record with this value already exists" });
      return;
    }
    if (err.code === "23503") {
      res.status(409).json({ success: false, message: "This record is referenced by other data" });
      return;
    }
    if (err.code === "22P02") {
      res.status(400).json({ success: false, message: "Invalid input format" });
      return;
    }
  }

  const status = err instanceof CustomError ? err.status : 500;
  console.error(err);
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
