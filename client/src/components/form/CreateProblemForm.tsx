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
import { useProblemStore } from "@/store/problem-store";
import { useNavigate } from "react-router-dom";

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

const sampledpData = {
  title: "Fibonacci Number",
  description:
    "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1.",
  difficulty: "EASY" as const,
  tags: ["Dynamic Programming", "Math", "Recursion"],
  constraints: "0 <= n <= 30",
  hints:
    "Use memoization to avoid redundant calculations or iterative approach with O(1) space",
  editorial:
    "This problem can be solved using dynamic programming approach. We can use either bottom-up DP with O(n) space, or optimize to O(1) space by keeping track of only the last two numbers.",
  testcases: [
    { input: "0", output: "0" },
    { input: "1", output: "1" },
    { input: "2", output: "1" },
    { input: "3", output: "2" },
    { input: "4", output: "3" },
    { input: "5", output: "5" },
  ],
  examples: {
    JAVASCRIPT: {
      input: "4",
      output: "3",
      explanation:
        "F(4) = F(3) + F(2) = 2 + 1 = 3. The sequence is: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3",
    },
    PYTHON: {
      input: "4",
      output: "3",
      explanation:
        "F(4) = F(3) + F(2) = 2 + 1 = 3. The sequence is: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3",
    },
    JAVA: {
      input: "4",
      output: "3",
      explanation:
        "F(4) = F(3) + F(2) = 2 + 1 = 3. The sequence is: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `const readline = require('readline');

function fib(n) {
    // Write your code here
    return 0;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const n = parseInt(line.trim());
    const result = fib(n);
    console.log(result);
    rl.close();
});`,
    PYTHON: `def fib(n):
    # Write your code here
    return 0

import sys
n = int(sys.stdin.read().strip())
result = fib(n)
print(result)`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static int fib(int n) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int result = fib(n);
        System.out.println(result);
        sc.close();
    }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `const readline = require('readline');

function fib(n) {
    if (n <= 1) return n;
    
    let prev = 0, curr = 1;
    for (let i = 2; i <= n; i++) {
        let next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const n = parseInt(line.trim());
    const result = fib(n);
    console.log(result);
    rl.close();
});`,
    PYTHON: `def fib(n):
    if n <= 1:
        return n
    
    prev, curr = 0, 1
    for i in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr

import sys
n = int(sys.stdin.read().strip())
result = fib(n)
print(result)`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static int fib(int n) {
        if (n <= 1) return n;
        
        int prev = 0, curr = 1;
        for (int i = 2; i <= n; i++) {
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int result = fib(n);
        System.out.println(result);
        sc.close();
    }
}`,
  },
};

const CreateProblemForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isCreatingProblem, createProblem } = useProblemStore();
  const navigate = useNavigate();

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
      await createProblem(values);
      if (!isCreatingProblem) {
        navigate("/problems");
      }
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
                  {tagFields?.map((_, index) => (
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
                                    theme="vs-dark"
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
                                    theme="vs-dark"
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
                {isCreatingProblem ? (
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
