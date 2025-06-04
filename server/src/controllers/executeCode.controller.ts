import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ExecuteCodeType } from "../validations/execute-code.validations";
import { ApiError } from "../utils/api-error";
import { getLanguageName, pollBatchResults, submitBatch } from "../lib/judge0";
import { db } from "../lib/db";
import { ApiResponse } from "../utils/api-response";

export const executeCode = asyncHandler(
  async (
    req: Request<{}, {}, ExecuteCodeType>,
    res: Response,
  ): Promise<void> => {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    if (!source_code || !language_id || !problemId) {
      throw new ApiError(
        400,
        "Source code, language ID and problem ID are required",
      );
    }

    if (!Number.isInteger(language_id)) {
      throw new ApiError(400, "Language ID must be an integer");
    }

    const validLanguageIds = [71, 62, 63];
    if (!validLanguageIds.includes(language_id)) {
      throw new ApiError(400, "Language ID is not supported");
    }

    // console.log("Body", req.body);
    // console.log("-----------------------------");

    // 1. Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length === 0 ||
      stdin.length !== expected_outputs.length
    ) {
      throw new ApiError(
        400,
        "Stdin and expected outputs must be arrays of equal length",
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

    const tokens = submitResponse.map((res) => res.token);
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
      const expected_output = expected_outputs[index].trim();

      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      // console.log(`Test case ${index + 1}`);
      // console.log(`Input ${stdin[index]}`);
      // console.log(`Expected Output ${expected_output}`);
      // console.log(`Actual Output ${stdout}`);
      // console.log(`Matched ${passed}`);
      // console.log("-----------------------------");

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description || null,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    // console.log("Detailed Result", detailedResult);
    // console.log("-----------------------------");

    // 6. store submission summary
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

    // console.log(submission);
    // console.log("-----------------------------");

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

    // console.log(submissionWithTestCase);
    // console.log("-----------------------------");

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { submission: submissionWithTestCase },
          "Code executed successfully",
        ),
      );
  },
);
