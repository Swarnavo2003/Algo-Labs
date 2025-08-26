import { HeroHeader } from "@/components/header";
import ProblemsTable from "@/components/problems/ProblemsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ProblemsPage = () => {
  return (
    <div className="min-h-screen">
      <HeroHeader />
      <div className="flex flex-col items-center h-screen pt-25">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Welcome To <span className="text-purple-500">AlgoLabs</span>
          </h1>
          <p className="pt-2">
            A platform inspired by Leetcode which helps you prepare for coding
            interviews and helps you improve your coding skills
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto pt-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Problems</h1>
            <Button className="bg-purple-500 text-white">
              <PlusCircle />
              <span className="ml-1">Add Problem</span>
            </Button>
          </div>
          <div className="pt-4">
            <ProblemsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
