import {NextFunction, Request, Response} from "express";
import {ZodSchema} from "zod";
import {ApiError} from "../utils/api-error";

export const validateZod =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));

      throw new ApiError(400, "Validation Error", errors);
    }

    req.body = result.data;
    next();
  };
