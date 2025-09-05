import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { Problem } from "@/types";

const TestCaseArea = ({ problem }: { problem: Problem }) => {
  return (
    <Card className="rounded-none h-full p-1">
      <Tabs defaultValue="case-1" className="h-full">
        <TabsList className={`flex w-full gap-1`}>
          {problem.testcases.slice(0, 3).map((_, index) => (
            <TabsTrigger key={index} value={`case-${index + 1}`}>
              Case {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {problem.testcases.slice(0, 3).map((example, index) => (
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
