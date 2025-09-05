export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role: "ADMIN" | "USER";
};

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type Language = "JAVA" | "PYTHON" | "JAVASCRIPT";

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  input: string;
  output: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  userId: string;
  examples: Record<Language, Example>;
  constraints: string;
  hints: string | null;
  editorial: string | null;
  testcases: TestCase[];
  codeSnippets: Record<Language, string>;
  referenceSolutions: Record<Language, string>;
  createdAt: string;
  updatedAt: string;
}

export interface RunType {
  source_code: string;
  language_id: number;
  stdin: string[];
  expected_output: string[];
}

export interface Submission {
  source_code: string;
  language_id: number;
  stdin: string[];
  expected_output: string[];
  problemId: string;
}

export interface RunSummary {
  language: string;
  allPassed: boolean;
  totalTestCases: number;
  passedTestCases: number;
  testResults: {
    testCase: number;
    input: string;
    passed: boolean;
    stdout: string;
    expected: string;
    stderr: string | null;
    compile_output: string | null;
    status: string;
    memory: string;
    time: string;
  }[];
  summary: {
    status: string;
    executionTime: string;
    memoryUsed: string;
  };
}

export interface SubmissionResponse {
  submission: {
    id: string;
    userId: string;
    problemId: string;
    sourceCode: string;
    language: string;
    stdin: string;
    stdout: string;
    stderr: string | null;
    compileOutput: string | null;
    status: string;
    memory: string;
    time: string;
    createdAt: string;
    updatedAt: string;
    testCases: {
      id: string;
      submissionId: string;
      testCase: number;
      passed: boolean;
      stdout: string;
      expected: string;
      stderr: string | null;
      compileOutput: string | null;
      status: string;
      memory: string;
      time: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

export const LANGUAGE_MAP: Record<string, number> = {
  javascript: 63,
  java: 62,
  python: 71,
};
