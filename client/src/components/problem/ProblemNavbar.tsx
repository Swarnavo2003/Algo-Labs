import { Play, Share } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

const ProblemNavbar = () => {
  return (
    <nav className="mx-4 mt-3 px-6 py-2 flex items-center justify-between border shadow-sm h-16 rounded-2xl hover:shadow-md transition-all duration-200">
      <h1 className="text-lg font-semibold truncate max-w-xs">Problem Name</h1>

      <div className="flex items-center gap-3">
        <Button
          size={"sm"}
          variant={"outline"}
          className="h-9 px-3 transition-all duration-200"
        >
          <Play className="w-4 h-4" />
        </Button>
        <Button
          size={"sm"}
          variant={"secondary"}
          className="h-9 px-4 transition-all duration-200"
        >
          Submit
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 transition-colors duration-200"
        >
          <Share className="w-4 h-4" />
        </Button>
        <Select defaultValue="javascript">
          <SelectTrigger className="min-w-[100px] h-9 border px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium">
            JavaScript
          </SelectTrigger>
          <SelectContent className="min-w-[120px]">
            <SelectItem value="javascript" className="text-sm">
              JavaScript
            </SelectItem>
            <SelectItem value="python" className="text-sm">
              Python
            </SelectItem>
            <SelectItem value="java" className="text-sm">
              Java
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};

export default ProblemNavbar;
