import { Request, Response, NextFunction } from "express";

export default function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;

  res.status(status).json({
    status,
    code: err.code || "INTERNAL_ERROR",
    message: status === 500 ? "Internal server error" : err.message,
    details: err.details || []
  });
}