import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import z from "zod";
import { Card, CardHeader, CardTitle } from "../ui/card";

const exampleSchema = z.object({
  input: z.string().trim().min(1, "Input is required"),
  output: z.string().trim().min(1, "Output is required"),
  explanation: z.string().trim().optional(),
});

const codeSchema = z.string().min(1, "Code snippet is required");

export const problemSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z
    .array(
      z.string().trim().min(1, "Tag cannot be empty").max(20, "Tag is too long")
    )
    .min(1, "At least one tag is required"),
  constraints: z.string().trim().min(1, "Constraints are required"),
  hints: z.string().trim().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().trim().min(1, "Input is required"),
        output: z.string().trim().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),

  examples: z.object({
    JAVASCRIPT: exampleSchema.optional(),
    PYTHON: exampleSchema.optional(),
    JAVA: exampleSchema.optional(),
  }),

  codeSnippets: z.object({
    JAVASCRIPT: codeSchema,
    PYTHON: codeSchema,
    JAVA: codeSchema,
  }),

  referenceSolutions: z.object({
    JAVASCRIPT: codeSchema,
    PYTHON: codeSchema,
    JAVA: codeSchema,
  }),
});
export type ProblemValues = z.infer<typeof problemSchema>;

const CreateProblemForm = () => {
  const form = useForm<ProblemValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      testcases: [{ input: "", output: "" }],
      tags: [""],
      constraints: "",
      hints: "",
      editorial: "",
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });
  const { control, setValue } = form;
  const tagFields = useWatch({
    control,
    name: "tags",
  });
  const appendTag = () => {
    setValue("tags", [...(tagFields || []), ""]);
  };
  const removeTag = (index: number) => {
    const updated = tagFields?.filter((_, i) => i !== index) || [];
    setValue("tags", updated);
  };
  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control: control,
    name: "testcases",
  });
  return (
    <Card className="h-screen">
      <CardHeader>
        <CardTitle>Create Problem</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default CreateProblemForm;
