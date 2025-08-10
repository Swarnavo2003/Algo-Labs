import {Request, Response} from "express";
import {asyncHandler} from "../utils/async-handler";
import {
  UserLoginInput,
  UserRegistrationInput,
} from "../validations/auth.validations";
import {ApiError} from "../utils/api-error";
import {db} from "../lib/db";
import {comparePassword, hashPassword} from "../lib/hash-password";
import {generateToken} from "../lib/jwt-token";
import {ApiResponse} from "../utils/api-response";

export const registerUser = asyncHandler(
  async (
    req: Request<{}, {}, UserRegistrationInput>,
    res: Response,
  ): Promise<void> => {
    const {email, password, name} = req.body;

    if (!email || !password || !name) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "USER",
      },
    });

    const tokenResponse = generateToken({
      id: newUser?.id,
      email: newUser?.email,
      role: newUser?.role as string,
    });

    res.cookie("token", tokenResponse, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            id: newUser?.id,
            email: newUser?.email,
            name: newUser?.name,
            role: newUser?.role,
          },
        },
        `🎉Success! ${name} is now part of AlgoLabs.`,
      ),
    );
  },
);

export const loginUser = asyncHandler(
  async (
    req: Request<{}, {}, UserLoginInput>,
    res: Response,
  ): Promise<void> => {
    const {email, password} = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const tokenResponse = generateToken({
      id: user?.id,
      email: user?.email,
      role: user?.role as string,
    });

    res.cookie("token", tokenResponse, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
          role: user.role,
        },
        `Welcome back, ${user.name}!`,
      ),
    );
  },
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
  },
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  },
);
