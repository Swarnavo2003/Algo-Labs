import { z } from "zod";

export const executeCodeSchema = z.object({
  source_code: z.string().min(1, "Source code is required"),
  language_id: z
    .number()
    .min(1, "Language ID is required")
    .positive("Language ID must be a positive number"),
  stdin: z.array(z.string()).min(1, "At least one stdin testcase is required"),
  expected_outputs: z
    .array(z.string())
    .min(1, "At least one expected output is required"),
  problemId: z.string().uuid("Problem ID must be a valid UUID"),
});

export type ExecuteCodeType = z.infer<typeof executeCodeSchema>;
