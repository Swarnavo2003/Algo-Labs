import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-error.js";
import {db} from "../lib/db.js";
import {comparePassword, hashPassword} from "../lib/hash-password.js";
import {generateToken} from "../lib/jwt-token.js";
import {ApiResponse} from "../utils/api-response.js";
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
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
    role: newUser?.role,
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
});

export const loginUser = asyncHandler(async (req, res) => {
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
    role: user?.role,
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
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
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
      image: true,
      name: true,
      bio: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const {name, bio} = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const existingUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const updateData = {};

  let avatarUrl;
  if (req.files && req.files.avatar && req.files.avatar.length > 0) {
    avatarUrl = req.files.avatar[0].path;
  }

  if (avatarUrl) {
    if (existingUser.public_id) {
      await deleteFromCloudinary(existingUser.public_id);
    }

    const result = await uploadOnCloudinary(avatarUrl, "avatars");

    updateData.image = result.secure_url;
    updateData.public_id = result.public_id;
  }

  if (name) {
    updateData.name = name;
  }

  if (bio) {
    updateData.bio = bio;
  }

  const updatedUser = await db.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});
