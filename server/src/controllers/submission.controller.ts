import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../lib/db";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

export const getAllSubmissions = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "User not found");
    }

    const submission = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    if (!submission) {
      throw new ApiError(404, "No submission found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { submission },
          "Submissions Fetched Successfully",
        ),
      );
  },
);

export const getSubmissionForProblem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const problemId = req.params.id;

    if (!userId) {
      throw new ApiError(404, "User not found");
    }

    if (!problemId) {
      throw new ApiError(404, "Problem not found");
    }

    const submission = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    if (!submission) {
      throw new ApiError(404, "No submission found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, { submission }, "Submission Fetched Successfully"),
      );
  },
);

export const getAllSubmissionsForProblem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const problemId = req.params.id;

    if (!problemId) {
      throw new ApiError(404, "Problem not found");
    }

    const submission = await db.submission.findMany({
      where: {
        problemId: problemId,
      },
    });

    if (!submission) {
      throw new ApiError(404, "No submission found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { submission },
          "Submissions Fetched Successfully",
        ),
      );
  },
);
