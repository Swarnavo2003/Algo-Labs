import { useSubmissionStore } from "@/store/submission-store";
import { CheckCircle, Clock, Code, Database, XCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Editor } from "@monaco-editor/react";

const ProblemSubmissions = () => {
  const { isLoading, userSubmissions } = useSubmissionStore();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
      case "wrong answer":
        return "text-red-600 bg-red-50 border-red-200";
      case "time limit exceeded":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "runtime error":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const parseTimeArray = (timeStr: string): string => {
    try {
      const timeArray = JSON.parse(timeStr);
      if (Array.isArray(timeArray) && timeArray.length > 0) {
        return timeArray[0];
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  };

  const parseMemoryArray = (memoryStr: string): string => {
    try {
      const memoryArray = JSON.parse(memoryStr);
      if (Array.isArray(memoryArray) && memoryArray.length > 0) {
        return memoryArray[0];
      }
      return memoryStr;
    } catch {
      return memoryStr;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[650px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!userSubmissions.length) {
    return (
      <div className="h-[650px] flex items-center justify-center">
        <div className="text-center">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Submissions Yet
          </h3>
          <p className="text-sm text-gray-500">
            Submit your solution to see your submissions here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[650px] p-4">
      <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
      <ScrollArea className="h-[580px] p-2 pr-4">
        <div className="space-y-4">
          {userSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    <Badge
                      className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
                        submission.status
                      )}`}
                      variant={"outline"}
                    >
                      {submission.status}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {parseTimeArray(submission.time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Memory:</span>
                    <span className="font-medium">
                      {parseMemoryArray(submission.memory)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Source Code
                  </h4>
                  <div className="border rounded-md overflow-hidden">
                    <Editor
                      height="200px"
                      language={submission.language.toLowerCase()}
                      value={submission.sourceCode}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 12,
                        wordWrap: "on",
                        lineNumbers: "on",
                        folding: false,
                        glyphMargin: false,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "none",
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                      }}
                      theme="vs-dark"
                    />
                  </div>
                </div>

                {submission.stderr && (
                  <div className="mt-3 space-y-2">
                    <h4 className="text-sm font-medium text-red-700">
                      Error Output
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-xs font-mono">
                      <pre className="whitespace-pre-wrap">
                        {submission.stderr}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProblemSubmissions;
