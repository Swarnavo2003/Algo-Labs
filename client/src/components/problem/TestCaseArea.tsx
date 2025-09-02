import type { ProblemResponse } from "@/pages/ProblemPage";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const TestCaseArea = ({ problem }: { problem: ProblemResponse }) => {
  return (
    <Card className="rounded-none h-full p-1">
      <Tabs defaultValue="case-1" className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="case-1">Case 1</TabsTrigger>
          <TabsTrigger value="case-2">Case 2</TabsTrigger>
          <TabsTrigger value="case-3">Case 3</TabsTrigger>
        </TabsList>
        {problem.examples.map((example, index) => (
          <TabsContent key={index} value={`case-${index + 1}`}>
            <Card className="h-full">
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 border border-gray-600 px-2 py-4 rounded-lg">
                  <span className="text-sm font-semibold">Input:</span>
                  <span className="text-sm">{example.input}</span>
                </div>
                <div className="flex items-center space-x-2 border border-gray-600 px-2 py-4 rounded-lg">
                  <span className="text-sm font-semibold">Output:</span>
                  <span className="text-sm">{example.output}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default TestCaseArea;
