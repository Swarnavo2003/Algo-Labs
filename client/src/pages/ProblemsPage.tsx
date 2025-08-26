import { HeroHeader } from "@/components/header";
import ProblemsTable from "@/components/problems/ProblemsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ProblemsPage = () => {
  return (
    <div className="min-h-screen">
      <HeroHeader />
      <div className="flex flex-col items-center pt-25 px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center max-w-4xl">
          <h1 className="text-4xl font-bold">
            Welcome To <span className="text-purple-500">AlgoLabs</span>
          </h1>
          <p className="pt-2">
            A platform inspired by Leetcode which helps you prepare for coding
            interviews and helps you improve your coding skills
          </p>
        </div> */}

        <div className="w-full max-w-5xl mx-auto pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold">Problems</h1>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <PlusCircle className="w-4 h-4" />
              <span className="ml-1">Add Problem</span>
            </Button>
          </div>
          <div className="w-full">
            <ProblemsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
