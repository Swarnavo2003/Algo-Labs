import {z} from "zod";

const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

const ProgrammingLanguageEnum = z.enum(["JAVASCRIPT", "PYTHON", "JAVA"]);

const ExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

const TestCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
});

export const problemCreationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: DifficultyEnum,
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  examples: z.record(ProgrammingLanguageEnum, ExampleSchema),
  constraints: z.string().optional(),
  hints: z.array(z.string()).optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(TestCaseSchema)
    .min(1, "At least one testcase is required"),
  codeSnippets: z.record(ProgrammingLanguageEnum, z.string()),
  referenceSolutions: z.record(ProgrammingLanguageEnum, z.string()),
});
