import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Editor } from "@monaco-editor/react";
import { sampleData } from "@/data/sample";

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type Language = "JAVASCRIPT" | "PYTHON" | "JAVA";

interface Tag {
  value: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface LanguageExample {
  input: string;
  output: string;
  explanation?: string;
}

interface Examples {
  JAVASCRIPT: LanguageExample;
  JAVA: LanguageExample;
  PYTHON: LanguageExample;
}

interface CodeSolutions {
  JAVASCRIPT: string;
  JAVA: string;
  PYTHON: string;
}

interface ProblemFormData {
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: Tag[];
  constraints: string;
  hints?: string; // Changed from string[] to string
  editorial?: string;
  testcases: TestCase[];
  examples: Examples;
  codeSnippets: CodeSolutions;
  referenceSolutions: CodeSolutions;
}

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z
    .array(z.object({ value: z.string() }))
    .min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(), // Changed from z.array(z.string()).optional()
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const CreateProblemForm = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  // Initialize React Hook Form with Zod validation and default values
  const form = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      hints: "",
      constraints: "",
      tags: [{ value: "" }],
      testcases: [{ input: "", output: "" }],
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
        JAVASCRIPT: "// Add your reference javascript solution here",
        PYTHON: "# Add your reference python solution here",
        JAVA: "// Add your reference java solution here",
      },
    },
  });

  // Sets up dynamic array management for test cases
  const {
    fields: testcasesFields, // Current test cases fields
    append: appendTestCase, // Adds new test case
    remove: removeTestCase, // Removes test case index
    // replace: replaceTestCase, // Replaces entire test cases array
  } = useFieldArray({
    control: form.control,
    name: "testcases",
  });

  // Sets up dynamic array management for tags
  const {
    fields: tagsFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control: form.control,
    name: "tags", // This is separate and targets "tags"
  });

  const getMonacoLanguage = (language: string) => {
    switch (language) {
      case "JAVASCRIPT":
        return "javascript";
      case "PYTHON":
        return "python";
      case "JAVA":
        return "java";
      default:
        return "javascript";
    }
  };

  const onSubmit = async (data: ProblemFormData) => {
    try {
      console.log("I am here");
      const transformedData = {
        ...data,
        tags: data.tags.map((tag) => tag.value),
      };
      console.log("Form Data:", transformedData);
      // Add your registration logic here
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error (show toast, etc.)
    } finally {
      // setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const example = sampleData;

    const transformedData: ProblemFormData = {
      title: example.title,
      description: example.description,
      difficulty: example.difficulty,
      tags: example.tags.map((tag) => ({ value: tag })),
      constraints: example.constraints,
      hints: example.hints,
      editorial: example.editorial,
      testcases: example.testcases,
      examples: example.examples,
      codeSnippets: example.codeSnippets,
      referenceSolutions: example.referenceSolutions,
    };

    replaceTags(transformedData.tags);

    form.reset(transformedData);
  };

  const languages: Language[] = ["JAVASCRIPT", "PYTHON", "JAVA"];
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl md:text-3xl flex items-center justify-between gap-3">
              <h1>Create Problem</h1>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={loadSampleData}>Load Data</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Basic Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Basic Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description Field */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Difficulty Field */}
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
                                <SelectValue placeholder="Select a difficulty" />
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

              {/* Tags Section */}
              <Card className="mt-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Tags
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendTag({ value: "" })}
                    >
                      <Plus className="w-4 h-5 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-10">
                  {tagsFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 border p-2 rounded-xl"
                    >
                      <FormField
                        control={form.control}
                        name={`tags.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="">
                            <FormControl>
                              <Input placeholder="Enter Tag" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                        disabled={tagsFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Test Cases Section */}
              <Card className="mt-2">
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
                      <Plus className="w-4 h-5 mr-1" />
                      Add TestCase
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {testcasesFields.map((field, index) => (
                    <Card key={field.id} className="mt-2">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            Test Cases ${index + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTestCase(index)}
                          >
                            <Trash2 className="w-4 h-4 mr-1 text-destructive" />
                            Remove
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    placeholder="Enter expected input"
                                    className="min-h-24 resize-y"
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

              {/* Code Editor Section */}
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Programming Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="JAVASCRIPT">
                    <TabsList className="grid w-full grid-cols-3">
                      {languages.map((lang) => (
                        <TabsTrigger key={lang} value={lang}>
                          {lang}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {languages.map((language) => (
                      <TabsContent
                        key={language}
                        value={language}
                        className="space-y-6"
                      >
                        {/* Started Code Template */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Started Code Template
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <FormField
                              control={form.control}
                              name={`codeSnippets.${language}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="border rounded-md overflow-hidden">
                                      <Editor
                                        height="300px"
                                        language={getMonacoLanguage(language)}
                                        theme="vs-dark"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={{
                                          minimap: { enabled: false },
                                          fontSize: 14,
                                          lineNumbers: "on",
                                          roundedSelection: false,
                                          scrollBeyondLastLine: false,
                                          automaticLayout: true,
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
                            <CardTitle className="text-lg flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-orange-500" />
                              Refrence Solution
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <FormField
                              control={form.control}
                              name={`referenceSolutions.${language}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="border rounded-md overflow-hidden">
                                      <Editor
                                        height="300px"
                                        language={getMonacoLanguage(language)}
                                        theme="vs-dark"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={{
                                          minimap: { enabled: false },
                                          fontSize: 14,
                                          lineNumbers: "on",
                                          roundedSelection: false,
                                          scrollBeyondLastLine: false,
                                          automaticLayout: true,
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
                            <CardTitle className="text-lg">Examples</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name={`examples.${language}.input`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Input</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Example Input"
                                        className="min-h-20 resize-y"
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
                                        placeholder="Example Input"
                                        className="min-h-20 resize-y"
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
                                    <FormLabel>Explanation(optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Explain the example"
                                        className="min-h-24 resize-y"
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
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Extra Details */}
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Extra Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Constraints Field */}
                    <FormField
                      control={form.control}
                      name="constraints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Constraints</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Hints Field */}
                    <FormField
                      control={form.control}
                      name="hints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hints</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Editorial Field */}
                    <FormField
                      control={form.control}
                      name="editorial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Editorial</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-start pt-6">
                <Button type="submit" size="lg" className="bg-orange-500">
                  <Save className="w-5 h-5 mr-2" />
                  Create Problem
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProblemForm;
