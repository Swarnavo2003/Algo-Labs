import {ApiError} from "../utils/api-error.js";

export const validateZod = (schema) => (req, res, next) => {
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
