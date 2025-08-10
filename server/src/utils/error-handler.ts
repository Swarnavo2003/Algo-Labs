import { NextFunction, Request, Response } from "express";
import { ApiError } from "./api-error";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    if (err.statusCode && err.message) {
      res.status(err.statusCode).json({
        statusCode: err.statusCode,
        success: err.success,
        message: err.message,
      });
      return;
    }
  }
};
