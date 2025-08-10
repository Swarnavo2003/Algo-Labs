class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors?: any[] | null;

  constructor(
    statusCode: number,
    message: string,
    errors?: any[] | null,
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
