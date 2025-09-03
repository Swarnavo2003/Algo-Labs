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
