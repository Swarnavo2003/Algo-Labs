import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProblemDescription from "./ProblemDescription";
import ProblemSubmissions from "./ProblemSubmissions";
import { Code2, FileText, Lightbulb, MessageSquare } from "lucide-react";
import type { Problem } from "@/types";

const ProblemInformationArea = ({ problem }: { problem: Problem }) => {
  return (
    <Card className="rounded-none p-1">
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-4 rounded-lg">
          <TabsTrigger value="description">
            <FileText />
            <span className="hidden md:block">Description</span>
          </TabsTrigger>
          <TabsTrigger value="submission">
            <Code2 />
            <span className="hidden md:block">Submission</span>
          </TabsTrigger>
          <TabsTrigger value="hints">
            <Lightbulb />
            <span className="hidden md:block">Hints</span>
          </TabsTrigger>
          <TabsTrigger value="discussion">
            <MessageSquare />
            <span className="hidden md:block">Discussion</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <ProblemDescription problem={problem} />
        </TabsContent>
        <TabsContent value="submission" className="flex-1 min-h-0">
          <ProblemSubmissions />
        </TabsContent>
        <TabsContent value="hints">Hints</TabsContent>
        <TabsContent value="discussion">Discussion</TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProblemInformationArea;
