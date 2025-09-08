import { useSubmissionStore } from "@/store/submission-store";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import type { Problem } from "@/types";
import { useProblemStore } from "@/store/problem-store";
import { CheckCircle } from "lucide-react";

const ProblemDescription = ({ problem }: { problem: Problem }) => {
  const { solvedProblems } = useProblemStore();
  const { allSubmissions } = useSubmissionStore();
  return (
    <ScrollArea className="h-[650px] p-2 pr-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{problem.title}</h1>
        {problem && solvedProblems.some((p) => p.id === problem.id) && (
          <CheckCircle className="ml-2 size-4 text-green-500" />
        )}
      </div>
      <p className="mt-2 text-sm text-gray-300">
        {allSubmissions.length} submissions
      </p>
      <div className="mt-4 flex flex-col space-y-1">
        <Badge
          className={`text-white ${
            problem.difficulty === "EASY" ? "bg-green-500 " : ""
          } ${problem.difficulty === "MEDIUM" ? "bg-yellow-500" : ""} ${
            problem.difficulty === "HARD" ? "bg-red-500" : ""
          }`}
        >
          {problem.difficulty}
        </Badge>
        <div className="space-x-1">
          {problem.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold">{problem.description}</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Examples</h2>
        <div className="mt-2 flex flex-col space-y-2">
          {problem.testcases.slice(0, 3).map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Example {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Input: {example.input}</p>
                <p>Output: {example.output}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {problem.constraints && (
          <>
            <h2 className="mt-4 text-lg font-semibold">Constraints</h2>
            <p className="mt-2">{problem.constraints}</p>
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default ProblemDescription;
