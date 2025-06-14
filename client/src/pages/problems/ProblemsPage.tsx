import ProblemTable from "@/components/ProblemTable";
import { Card } from "@/components/ui/card";
import { useProblemStore } from "@/store/useProblemStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const ProblemsPage = () => {
  const { problems, getAllProblems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  console.log(problems);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-10 animate-spin text-orange-500" />
      </div>
    );
  }
  return (
    <div className="relative w-full min-h-screen top-20">
      {/* <div className="absolute top-2 left-2 w-1/3 h-1/3 bg-orange-600 opacity-30 blur-3xl rounded-md bottom-9"></div> */}
      <div className="mx-auto min-h-screen max-w-2xl md:max-w-6xl h-full flex flex-col items-center mt-10 text-center">
        <h1 className="text-2xl md:text-4xl font-bold tracking-wider ">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-orange-800 via-orange-600 to-orange-400 bg-clip-text text-transparent">
            AlgoLabs
          </span>
        </h1>
        <p className="mt-5 text-xs md:text-sm text-gray-400 font-semibold">
          A platform inspired by leetcode which will help you prepare for coding
          interviews and helps you improve your problem solving skills by
          solving coding problems
        </p>
        <Card className="w-full mt-10">
          {problems.length <= 0 ? (
            <h1>No Problems Yet</h1>
          ) : (
            <ProblemTable problems={problems} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProblemsPage;
