import {ApiError} from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.js";
import {ApiResponse} from "../utils/api-response.js";
import {db} from "../lib/db.js";

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (
    !title ||
    !description ||
    !difficulty ||
    !tags ||
    !examples ||
    !constraints ||
    !testcases ||
    !codeSnippets ||
    !referenceSolutions
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const exitingProblem = await db.problem.findUnique({
    where: {
      title: title,
    },
  });

  if (exitingProblem) {
    throw new ApiError(409, "Problem with this title already exists");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    // console.log(language, solutionCode);
    // console.log("------------------------------");

    const languageId = getJudge0LanguageId(language);
    // console.log("language ID: ", languageId);
    // console.log("------------------------------");

    if (!languageId) {
      throw new ApiError(400, `Language ${language} is not supported`);
    }

    const submission = testcases.map(({input, output}) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));
    // console.log("submission: ", submission);
    // console.log("------------------------------");

    const submissionResults = await submitBatch(submission);
    // console.log("Submission Result: ", submissionResults);
    // console.log("------------------------------");

    const tokens = submissionResults.map((result) => result.token);
    // console.log("Tokens: ", tokens);
    // console.log("------------------------------");

    const results = await pollBatchResults(tokens);
    // console.log("Result: ", results);
    // console.log("------------------------------");

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      console.log("Result: ", result);

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`,
        );
      }
    }
  }

  const newProblem = await db.problem.create({
    data: {
      userId: req.user?.id,
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    },
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {problem: newProblem},
        "Problem created successfully",
      ),
    );
});

export const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany();

  if (!problems) {
    throw new ApiError(404, "No problems found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, problems, "All Problems Fetched Successfully"));
});

export const getProblemById = asyncHandler(async (req, res) => {
  const problemId = req.params.id;

  if (!problemId) {
    throw new ApiError(400, "Problem ID is required");
  }

  const problem = await db.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem Fetched Successfully"));
});

export const updateProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.id;

  if (!problemId) {
    throw new ApiError(400, "Problem ID is required");
  }

  const existingProblem = await db.problem.findUnique({
    where: {
      id: problemId,
    },
  });
  if (!existingProblem) {
    throw new ApiError(404, "Problem not found");
  }

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (
    !title ||
    !description ||
    !difficulty ||
    !tags ||
    !examples ||
    !constraints ||
    !testcases ||
    !codeSnippets ||
    !referenceSolutions
  ) {
    throw new ApiError(400, "All fields are required");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    // console.log(language, solutionCode);
    // console.log("------------------------------");

    const languageId = getJudge0LanguageId(language);
    // console.log("language ID: ", languageId);
    // console.log("------------------------------");

    if (!languageId) {
      throw new ApiError(400, `Language ${language} is not supported`);
    }

    const submission = testcases.map(({input, output}) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));
    // console.log("submission: ", submission);
    // console.log("------------------------------");

    const submissionResults = await submitBatch(submission);
    // console.log("Submission Result: ", submissionResults);
    // console.log("------------------------------");

    const tokens = submissionResults.map((result) => result.token);
    // console.log("Tokens: ", tokens);
    // console.log("------------------------------");

    const results = await pollBatchResults(tokens);
    // console.log("Result: ", results);
    // console.log("------------------------------");

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      // console.log("Result: ", result);

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`,
        );
      }
    }
  }

  const updatedProblem = await db.problem.update({
    where: {
      id: problemId,
    },
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {problem: updatedProblem},
        "Problem Updated Successfully",
      ),
    );
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.id;

  if (!problemId) {
    throw new ApiError(400, "Problem ID is required");
  }

  const existingProblem = await db.problem.findUnique({
    where: {
      id: problemId,
    },
  });
  if (!existingProblem) {
    throw new ApiError(404, "Problem not found");
  }

  await db.problem.delete({
    where: {
      id: problemId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Problem Deleted Successfully"));
});

export const getSolvedProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany({
    where: {
      solvedBy: {
        some: {
          userId: req.user?.id,
        },
      },
    },
    include: {
      solvedBy: {
        where: {
          userId: req.user?.id,
        },
      },
    },
  });

  if (!problems) {
    throw new ApiError(404, "No problems found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, {problems}, "Solved Problems Fetched Successfully"),
    );
});
