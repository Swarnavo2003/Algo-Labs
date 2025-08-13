import {db} from "../lib/db.js";
import {getLanguageName, pollBatchResults, submitBatch} from "../lib/judge0.js";
import {ApiError} from "../utils/api-error.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";

export const executeCode = asyncHandler(async (req, res) => {
  const {source_code, language_id, stdin, expected_output, problemId} =
    req.body;

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!source_code || !language_id || !problemId) {
    throw new ApiError(400, "All fields are required");
  }

  if (!Number.isInteger(language_id)) {
    throw new ApiError(400, "Language ID must be an integer");
  }

  const validLanguageIds = [71, 62, 63];
  if (!validLanguageIds.includes(language_id)) {
    throw new ApiError(400, "Language ID is not supported");
  }

  // 1. Validate test cases
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_output) ||
    expected_output.length === 0 ||
    stdin.length !== expected_output.length
  ) {
    throw new ApiError(
      400,
      "Stdin and expected output must be arrays of the same length",
    );
  }

  // 2. Prepare each test case for judge0 batch submission
  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));
  // console.log("Submission", submissions);
  // console.log("-----------------------------");

  // 3. Send this batch of submission to judge0
  const submitResponse = await submitBatch(submissions);
  // console.log("Submission Results", submitResponse);
  // console.log("-----------------------------");

  const tokens = submitResponse.map((result) => result.token);
  // console.log("Tokens", tokens);
  // console.log("-----------------------------");

  // 4. Poll judge0 for all the submitted test cases
  const results = await pollBatchResults(tokens);
  // console.log("Results", results);
  // console.log("-----------------------------");

  // 5. Analyse test cases result
  let allPassed = true;

  const detailedResult = results.map((result, index) => {
    const stdout = result.stdout?.trim();
    const expectedOutput = expected_output[index].trim();

    const passed = stdout === expectedOutput;

    if (!passed) {
      allPassed = false;
    }

    // console.log(`Test case ${index + 1}`);
    // console.log(`Input ${stdin[index]}`);
    // console.log(`Expected Output ${expectedOutput}`);
    // console.log(`Actual Output ${stdout}`);
    // console.log(`Matched ${passed}`);
    // console.log("-----------------------------");

    return {
      testCase: index + 1,
      passed,
      stdout,
      expected: expectedOutput,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description || null,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  // console.log("Detailed Result", detailedResult);
  // console.log("-----------------------------");

  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResult.map((res) => res.stdout)),
      stderr: detailedResult.some((res) => res.stderr)
        ? JSON.stringify(detailedResult.map((res) => res.stderr))
        : null,
      compileOutput: detailedResult.some((res) => res.compile_output)
        ? JSON.stringify(detailedResult.map((res) => res.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: detailedResult.some((res) => res.memory)
        ? JSON.stringify(detailedResult.map((res) => res.memory))
        : null,
      time: detailedResult.some((res) => res.time)
        ? JSON.stringify(detailedResult.map((res) => res.time))
        : null,
    },
  });

  // console.log("Submission", submission);
  // console.log("-----------------------------");

  // 6. store submission summary
  if (allPassed) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {},
      create: {
        userId,
        problemId,
      },
    });
  }

  // 8. Save indivitual test case results using detailedResult
  const testCaseResults = detailedResult.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr ? result.stderr : null,
    compileOutput: result.compile_output ? result.compile_output : null,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({
    data: testCaseResults,
  });

  const submissionWithTestCase = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      testCases: true,
    },
  });

  // console.log("Submission with test cases", submissionWithTestCase);
  // console.log("-----------------------------");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {submission: submissionWithTestCase},
        "Code executed successfully",
      ),
    );
});

export const runCode = asyncHandler(async (req, res) => {
  const {source_code, language_id, stdin, expected_output} = req.body;

  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!source_code || !language_id) {
    throw new ApiError(400, "All fields are required");
  }

  if (!Number.isInteger(language_id)) {
    throw new ApiError(400, "Language ID must be an integer");
  }

  const validLanguageIds = [71, 62, 63];
  if (!validLanguageIds.includes(language_id)) {
    throw new ApiError(400, "Language ID is not supported");
  }

  // 1. Validate test cases (same as executeCode for now)
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_output) ||
    expected_output.length === 0 ||
    stdin.length !== expected_output.length
  ) {
    throw new ApiError(400, "Invalid test cases");
  }

  // 2. Prepare each test case for judge0 batch submission
  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  // 3. Send this batch of submission to judge0
  const submitResponse = await submitBatch(submissions);

  const tokens = submitResponse.map((result) => result.token);

  // 4. Poll judge0 for all the submitted test cases
  const results = await pollBatchResults(tokens);

  // 5. Analyze test cases result (no database storage)
  let allPassed = true;

  const detailedResult = results.map((result, index) => {
    const stdout = result.stdout?.trim();
    const expectedOutput = expected_output[index].trim();

    const passed = stdout === expectedOutput;

    if (!passed) {
      allPassed = false;
    }

    return {
      testCase: index + 1,
      input: stdin[index],
      passed,
      stdout,
      expected: expectedOutput,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description || null,
      memory: result.memory ? `${result.memory} KB` : null,
      time: result.time ? `${result.time} s` : null,
    };
  });

  // 6. Prepare response data (no database operations)
  const runResult = {
    language: getLanguageName(language_id),
    allPassed,
    totalTestCases: detailedResult.length,
    passedTestCases: detailedResult.filter((result) => result.passed).length,
    testResults: detailedResult,
    summary: {
      status: allPassed ? "All test cases passed" : "Some test cases failed",
      executionTime:
        detailedResult
          .reduce((total, result) => {
            return total + (parseFloat(result.time) || 0);
          }, 0)
          .toFixed(3) + " s",
      memoryUsed:
        Math.max(
          ...detailedResult.map((result) => parseInt(result.memory) || 0),
        ) + " KB",
    },
  };

  // 7. Return results without storing in database
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {runResult},
        allPassed
          ? "Code executed successfully - All test cases passed!"
          : "Code executed - Some test cases failed",
      ),
    );
});
