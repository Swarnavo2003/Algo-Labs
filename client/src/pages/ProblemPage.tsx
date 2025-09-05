import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProblemNavbar from "@/components/problem/ProblemNavbar";
import ProblemInformationArea from "@/components/problem/ProblemInformationArea";
import CodeEditorArea from "@/components/problem/CodeEditorArea";
import TestCaseArea from "@/components/problem/TestCaseArea";
import { useProblemStore } from "@/store/problem-store";
import AlgoLabsLoader from "@/components/alogolabs-loader";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useExecutionStore } from "@/store/execution-store";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, isProblemLoading, problem } = useProblemStore();
  const { clearSubmission } = useExecutionStore();

  useEffect(() => {
    if (id) {
      getProblemById(id);
    }
    clearSubmission();
  }, [id]);

  if (isProblemLoading) return <AlgoLabsLoader />;

  return (
    <div className="w-full h-screen flex flex-col">
      {problem && <ProblemNavbar title={problem?.title} />}
      <div className="flex flex-1 p-2">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 w-full rounded-lg overflow-hidden shadow-xl"
        >
          <ResizablePanel defaultSize={40} minSize={20}>
            {problem && <ProblemInformationArea problem={problem} />}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={60} minSize={30}>
                {problem && <CodeEditorArea problem={problem} />}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={30}>
                {problem && <TestCaseArea problem={problem} />}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProblemPage;
