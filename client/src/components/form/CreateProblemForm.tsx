import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import z from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Editor } from "@monaco-editor/react";
import {
  FileText,
  Plus,
  Trash2,
  Code2,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  ArrowDown,
  Loader2,
} from "lucide-react";

const exampleSchema = z.object({
  input: z.string().trim().min(1, "Input is required"),
  output: z.string().trim().min(1, "Output is required"),
  explanation: z.string().trim().optional(),
});

const codeSchema = z.string().min(1, "Code snippet is required");

const problemSchema = z.object({
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

// Sample data for quick testing
const sampledpData = {
  title: "Fibonacci Number",
  description:
    "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
  difficulty: "EASY" as const,
  tags: ["Dynamic Programming", "Math", "Recursion"],
  constraints: "0 <= n <= 30",
  hints: "Use memoization to avoid redundant calculations",
  editorial: "This problem can be solved using dynamic programming approach...",
  testcases: [
    { input: "2", output: "1" },
    { input: "3", output: "2" },
    { input: "4", output: "3" },
  ],
  examples: {
    JAVASCRIPT: {
      input: "2",
      output: "1",
      explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1",
    },
    PYTHON: {
      input: "2",
      output: "1",
      explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1",
    },
    JAVA: {
      input: "2",
      output: "1",
      explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1",
    },
  },
  codeSnippets: {
    JAVASCRIPT: "function fib(n) {\n  // Write your code here\n}",
    PYTHON: "def fib(n):\n    # Write your code here\n    pass",
    JAVA: "class Solution {\n    public int fib(int n) {\n        // Write your code here\n    }\n}",
  },
  referenceSolutions: {
    JAVASCRIPT:
      "function fib(n) {\n  if (n <= 1) return n;\n  let dp = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}",
    PYTHON:
      "def fib(n):\n    if n <= 1:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]",
    JAVA: "class Solution {\n    public int fib(int n) {\n        if (n <= 1) return n;\n        int[] dp = new int[n + 1];\n        dp[1] = 1;\n        for (int i = 2; i <= n; i++) {\n            dp[i] = dp[i-1] + dp[i-2];\n        }\n        return dp[n];\n    }\n}",
  },
};

const CreateProblemForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sampleType, setSampleType] = useState("DP");

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

  const { control, setValue, handleSubmit } = form;

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

  const loadSampleData = () => {
    const sampleData = sampledpData;
    replacetestcases(sampleData.testcases.map((tc) => tc));
    form.reset({
      ...sampleData,
      difficulty: sampleData.difficulty,
    });
  };

  const onSubmit = async (values: ProblemValues) => {
    try {
      setIsLoading(true);
      console.log("Form submitted:", values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Problem created successfully!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
            <FileText className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Create Problem
          </CardTitle>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSampleType("DP")}
              >
                DP Problem
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSampleType("ST")}
              >
                String Problem
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={loadSampleData}
            >
              <ArrowDown className="h-4 w-4" />
              Load Sample
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base font-semibold">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter problem title"
                            className="text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base font-semibold">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter problem description"
                            className="min-h-32 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Difficulty
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Tags
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={appendTag}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Tag
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagFields?.map((field, index) => (
                    <div
                      key={`tag-${index}`}
                      className="flex items-center gap-2"
                    >
                      <FormField
                        control={form.control}
                        name={`tags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Enter tag" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTag(index)}
                        disabled={tagFields.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Test Cases
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendTestCase({ input: "", output: "" })}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Test Case
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Test Case #{index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                          disabled={testCaseFields.length === 1}
                        >
                          <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`testcases.${index}.input`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Input</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter test case input"
                                  className="min-h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`testcases.${index}.output`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expected Output</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter expected output"
                                  className="min-h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Code Editor Sections */}
            <div className="space-y-8">
              {(["JAVASCRIPT", "PYTHON", "JAVA"] as const).map((language) => (
                <Card key={language}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      {language}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Starter Code */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Starter Code Template
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name={`codeSnippets.${language}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="overflow-hidden rounded-md border">
                                  <Editor
                                    height="300px"
                                    language={language.toLowerCase()}
                                    theme="vs-light"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={{
                                      minimap: { enabled: false },
                                      fontSize: 14,
                                      automaticLayout: true,
                                      scrollBeyondLastLine: false,
                                      padding: { top: 16, bottom: 16 },
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Reference Solution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Reference Solution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name={`referenceSolutions.${language}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="overflow-hidden rounded-md border">
                                  <Editor
                                    height="300px"
                                    language={language.toLowerCase()}
                                    theme="vs-light"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={{
                                      minimap: { enabled: false },
                                      fontSize: 14,
                                      automaticLayout: true,
                                      scrollBeyondLastLine: false,
                                      padding: { top: 16, bottom: 16 },
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Examples */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Example</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`examples.${language}.input`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Input</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Example input"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`examples.${language}.output`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Output</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Example output"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`examples.${language}.explanation`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Explanation</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Explain the example"
                                    className="min-h-24"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="constraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Constraints</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter problem constraints"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hints (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter hints for solving the problem"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="editorial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Editorial (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter problem editorial/solution explanation"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end border-t pt-4">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="min-w-32"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Problem"
                )}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateProblemForm;
