import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import type { ProblemResponse } from "./ProblemInformationArea";

const ProblemDescription = ({ problem }: { problem: ProblemResponse }) => {
  return (
    <ScrollArea className="h-[650px] p-2 pr-4">
      <h1 className="text-3xl font-semibold">{problem.title}</h1>

      <div className="mt-4 flex flex-col space-y-1">
        <Badge
          className={`text-white ${
            problem.difficulty === "Easy" ? "bg-green-500 " : ""
          } ${problem.difficulty === "Medium" ? "bg-yellow-500" : ""} ${
            problem.difficulty === "Hard" ? "bg-red-500" : ""
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
          {problem.examples.map((example, index) => (
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
            <p className="mt-2">
              {problem.constraints.map((constraint, index) => (
                <p key={index}>
                  {index + 1}.{" "}
                  <span className="font-semibold pl-2">{constraint}</span>
                </p>
              ))}
            </p>
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default ProblemDescription;
