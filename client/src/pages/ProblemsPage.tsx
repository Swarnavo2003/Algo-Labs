import AlgoLabsLoader from "@/components/alogolabs-loader";
import { HeroHeader } from "@/components/header";
import ProblemsTable from "@/components/problems/ProblemsTable";
import { Button } from "@/components/ui/button";
import { useProblemStore } from "@/store/problem-store";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";

const ProblemsPage = () => {
  const { problems, isProblemsLoading, getAllProblems } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, []);

  if (isProblemsLoading) return <AlgoLabsLoader />;

  if (problems) console.log(problems);
  return (
    <div className="min-h-screen">
      <HeroHeader />
      <div className="flex flex-col items-center pt-25 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold">Problems</h1>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <PlusCircle className="w-4 h-4" />
              <span className="ml-1">Add Problem</span>
            </Button>
          </div>
          <div className="w-full">
            <ProblemsTable problems={problems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
