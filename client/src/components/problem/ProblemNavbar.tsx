import { Home, Loader2, Play, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { useNavigate, useParams } from "react-router-dom";
import { useExecutionStore } from "@/store/execution-store";
import { useEditorStore } from "@/store/editor-store";
import { LANGUAGE_MAP } from "@/types";

const ProblemNavbar = ({ title }: { title: string }) => {
  const { isRunning, isSubmitting, runCode, submitCode } = useExecutionStore();
  const { code, language } = useEditorStore();
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(id);

  const handleRunCode = async () => {
    await runCode({
      source_code: code,
      stdin: [],
      expected_output: [],
      language_id: LANGUAGE_MAP[language],
    });
  };

  const handleSubmitCode = async () => {
    await submitCode({
      source_code: code,
      stdin: [],
      expected_output: [],
      language_id: LANGUAGE_MAP[language],
      problemId: id as string,
    });
  };

  return (
    <nav className="mx-2 mt-2 px-4 py-2 flex items-center justify-between border shadow-sm h-12 rounded-lg">
      <div className="flex items-center gap-2">
        <Home
          onClick={() => navigate("/problems")}
          className="size-4 cursor-pointer"
        />
        <h1 className="text-sm font-semibold truncate max-w-xs">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={handleRunCode}
          className="h-8 px-2 transition-all duration-200"
        >
          {isRunning ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Play className="size-3" />
          )}
        </Button>
        <Button
          size={"sm"}
          onClick={handleSubmitCode}
          variant={"secondary"}
          className="h-8 px-4 text-sm transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              Wait
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="size-9 transition-colors duration-200"
        >
          <Share2 className="size-4" />
        </Button>

        <ModeToggle />
      </div>
    </nav>
  );
};

export default ProblemNavbar;
