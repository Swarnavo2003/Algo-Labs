import {db} from "../lib/db.js";
import {ApiError} from "../utils/api-error.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";

export const getAllSubmissions = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const submission = await db.submission.findMany({
    where: {
      userId,
    },
  });

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, submission, "Submissions fetched successfully"));
});

export const getSubmissionForProblem = asyncHandler(async (req, res) => {
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

  return res
    .status(200)
    .json(
      new ApiResponse(200, {submission}, "Submission Fetched Successfully"),
    );
});

export const getAllSubmissionsForProblem = asyncHandler(async (req, res) => {
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

  return res
    .status(200)
    .json(
      new ApiResponse(200, {submission}, "Submissions Fetched Successfully"),
    );
});
