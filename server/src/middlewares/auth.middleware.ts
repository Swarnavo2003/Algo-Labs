import {NextFunction, Request, Response} from "express";
import {asyncHandler} from "../utils/async-handler";
import {ApiError} from "../utils/api-error";
import {db} from "../lib/db";
import {UserPayload, verifyToken} from "../lib/jwt-token";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (!token) {
      throw new ApiError(404, "Unauthorized: Authentication token is required");
    }

    try {
      const decodedToken = verifyToken(token) as UserPayload;

      const user = await db.user.findFirst({
        where: {
          id: decodedToken.id,
          email: decodedToken.email,
        },
      });

      req.user = user as UserPayload;
      next();
    } catch (error) {
      throw new ApiError(401, "Unauthorized: Invalid or expired token");
    }
  },
);

export const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "User not found");
    }

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
      throw new ApiError(403, "Forbidden: Admins only");
    }

    next();
  },
);
