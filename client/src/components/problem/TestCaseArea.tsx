import { useExecutionStore } from "@/store/execution-store";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { Problem } from "@/types";
import { CircleCheck, Loader, X } from "lucide-react";

const TestCaseArea = ({ problem }: { problem: Problem }) => {
  const { isRunning, runResult } = useExecutionStore();

  console.log("Run Result : ", runResult);
  return (
    <Card className="rounded-none h-full p-1">
      <Tabs defaultValue="case-1" className="h-full">
        <TabsList className={`flex w-full gap-1`}>
          {problem.testcases.slice(0, 3).map((_, index) => (
            <TabsTrigger key={index} value={`case-${index + 1}`}>
              {isRunning ? (
                <Loader className="animate-spin text-green-500" />
              ) : runResult?.testResults[index] ? (
                runResult.testResults[index].passed ? (
                  <CircleCheck className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )
              ) : null}
              Case {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {problem.testcases.slice(0, 3).map((example, index) => (
          <TabsContent key={index} value={`case-${index + 1}`}>
            <Card className="h-full">
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 border border-gray-600 px-2 py-4 rounded-lg">
                  <span className="text-sm font-semibold">System Input:</span>
                  <span className="text-sm">{example.input}</span>
                </div>
                <div className="flex items-center space-x-2 border border-gray-600 px-2 py-4 rounded-lg">
                  <span className="text-sm font-semibold">
                    Expected Output:
                  </span>
                  <span className="text-sm">{example.output}</span>
                </div>
                {runResult && (
                  <div className="flex items-center space-x-2 border border-gray-600 px-2 py-4 rounded-lg">
                    <span className="text-sm font-semibold">
                      Actual Output:
                    </span>
                    <span className="text-sm">
                      {runResult.testResults[0].stdout}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default TestCaseArea;
