import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginSchemaTypes = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullname: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterSchemaTypes = z.infer<typeof registerSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  bio?: string;
  role?: "ADMIN" | "USER";
}

interface TestCase {
  input: string;
  output: string;
}

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Examples {
  [language: string]: Example;
}

interface CodeSnippets {
  [language: string]: string;
}

interface ReferenceSolutions {
  [language: string]: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  constraints: string;
  hints?: string;
  editorial?: string;
  testcases: TestCase[];
  examples: Examples;
  codeSnippets: CodeSnippets;
  referenceSolutions: ReferenceSolutions;
}
