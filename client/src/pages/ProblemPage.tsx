import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProblemNavbar from "@/components/problem/ProblemNavbar";
import ProblemInformationArea from "@/components/problem/ProblemInformationArea";
import CodeEditorArea from "@/components/problem/CodeEditorArea";
import TestCaseArea from "@/components/problem/TestCaseArea";

const ProblemPage = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <ProblemNavbar />
      <div className="flex flex-1 p-2">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 w-full rounded-lg overflow-hidden shadow-xl"
        >
          <ResizablePanel defaultSize={40} minSize={20}>
            <ProblemInformationArea />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel>
                <CodeEditorArea />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <TestCaseArea />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProblemPage;
