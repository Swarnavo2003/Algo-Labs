import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Problem } from "@/types";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

const ProblemTable = ({ problems }: { problems: Problem[] }) => {
  return (
    <div className="w-full rounded-xl shadow-lg border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Problem List</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track your progress and solve coding challenges
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 transition-colors">
              <TableHead className="w-[100px] text-center font-semibold py-4">
                Status
              </TableHead>
              <TableHead className="w-[250px] text-left font-semibold py-4">
                Problem Title
              </TableHead>
              <TableHead className="w-[300px] text-left font-semibold py-4">
                Tags
              </TableHead>
              <TableHead className="w-[120px] text-center font-semibold py-4">
                Difficulty
              </TableHead>
              <TableHead className="text-right font-semibold py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem, index) => (
              <TableRow
                key={problem.id}
                className="group hover:bg-muted/30 transition-all duration-200"
              >
                <TableCell className="w-[100px] text-center py-4">
                  <div className="flex justify-center">
                    <Checkbox className="h-5 w-5 rounded-md transition-colors" />
                  </div>
                </TableCell>

                <TableCell className="w-[250px] py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-medium border">
                      {index + 1}
                    </div>
                    <div className="font-medium hover:text-primary transition-colors cursor-pointer">
                      {problem.title}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="w-[300px] py-4">
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs font-medium px-2.5 py-1 rounded-full hover:bg-secondary/80 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="w-[120px] text-center py-4">
                  <Badge
                    variant="outline"
                    className="font-medium text-xs px-3 py-1.5 rounded-full transition-colors"
                  >
                    {problem.difficulty}
                  </Badge>
                </TableCell>

                <TableCell className="text-right py-4">
                  <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {problems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No problems found</h3>
          <p className="text-muted-foreground">
            Start by adding some coding problems to track your progress.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProblemTable;
