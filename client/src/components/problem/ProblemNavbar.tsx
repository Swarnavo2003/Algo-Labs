import { Play, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { ModeToggle } from "../mode-toggle";

const ProblemNavbar = () => {
  return (
    <nav className="mx-2 mt-2 px-4 py-2 flex items-center justify-between border shadow-sm h-12 rounded-lg">
      <h1 className="text-sm font-semibold truncate max-w-xs">Problem Name</h1>

      <div className="flex items-center gap-3">
        <Button
          size={"sm"}
          variant={"outline"}
          className="h-8 px-2 transition-all duration-200"
        >
          <Play className="size-3" />
        </Button>
        <Button
          size={"sm"}
          variant={"secondary"}
          className="h-8 px-4 text-sm transition-all duration-200"
        >
          Submit
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="size-8 p-0 transition-colors duration-200"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <Select defaultValue="javascript">
          <SelectTrigger className="min-w-[100px] h-9 border px-3 py-2 rounded-sm transition-all duration-200 text-sm font-medium">
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
        <ModeToggle />
      </div>
    </nav>
  );
};

export default ProblemNavbar;
