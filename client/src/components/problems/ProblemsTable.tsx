import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Edit, ExternalLink, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    solved: true,
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: "49.2%",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    solved: false,
    difficulty: "Medium",
    tags: ["Linked List", "Math", "Recursion"],
    acceptance: "38.7%",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    solved: true,
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    acceptance: "33.8%",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    solved: false,
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    acceptance: "36.2%",
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    solved: true,
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    acceptance: "32.8%",
  },
  {
    id: 6,
    title: "ZigZag Conversion",
    solved: false,
    difficulty: "Medium",
    tags: ["String"],
    acceptance: "42.1%",
  },
  {
    id: 7,
    title: "Reverse Integer",
    solved: true,
    difficulty: "Medium",
    tags: ["Math"],
    acceptance: "27.3%",
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    solved: false,
    difficulty: "Medium",
    tags: ["String"],
    acceptance: "16.8%",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30";
    case "hard":
      return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700";
  }
};

const getTagColor = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",
  ];
  return colors[index % colors.length];
};

const difficulties = ["Easy", "Medium", "Hard"];
const tags = [
  "Array",
  "Hash Table",
  "Linked List",
  "Math",
  "Recursion",
  "String",
  "Binary Search",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Queue",
  "Tree",
  "Binary Tree",
  "Binary Search Tree",
  "Heap",
  "Graph",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Divide and Conquer",
  "Sorting",
  "Searching",
  "Bit Manipulation",
  "Trie",
  "Union Find",
  "Topological Sort",
  "Breadth First Search",
  "Depth First Search",
  "Graph Coloring",
  "Shortest Path",
];

const ProblemsTable = () => {
  const [filterData, setFilterData] = useState({
    input: "",
    difficulty: "",
    tags: "",
  });

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchedTitle = problem.title
        .toLowerCase()
        .includes(filterData.input.toLowerCase());
      const matchesDifficulty =
        !filterData.difficulty ||
        problem.difficulty.toLowerCase() ===
          filterData.difficulty.toLowerCase();
      const matchedTags =
        !filterData.tags ||
        problem.tags.some(
          (tag) => tag.toLowerCase() === filterData.tags.toLowerCase()
        );
      return matchedTitle && matchesDifficulty && matchedTags;
    });
  }, [filterData]);
  return (
    <div className="w-full">
      <div className=" flex items-center gap-2 py-4">
        <Input
          value={filterData.input}
          name="input"
          onChange={(e) =>
            setFilterData({ ...filterData, input: e.target.value })
          }
          className="w-[300px]"
          placeholder="Search By Title"
        />

        <Select
          onValueChange={(value) =>
            setFilterData({ ...filterData, difficulty: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Difficulty</SelectLabel>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty.toLowerCase()}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setFilterData({ ...filterData, tags: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tags</SelectLabel>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag.toLowerCase()}>
                  {tag}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Card className="border shadow-sm dark:border-gray-800 dark:bg-gray-900/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-800">
              <TableHead className="w-[80px] text-center text-gray-800 dark:text-gray-300">
                Solved
              </TableHead>
              <TableHead className="w-[200px] text-gray-700 dark:text-gray-300">
                Title
              </TableHead>
              <TableHead className="w-[300px] text-gray-700 dark:text-gray-300">
                Tags
              </TableHead>
              <TableHead className="w-[100px] text-center text-gray-700 dark:text-gray-300">
                Difficulty
              </TableHead>
              <TableHead className="w-[120px] text-center text-gray-700 dark:text-gray-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <TableRow
                  key={problem.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800/50"
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={problem.solved}
                      className="mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 dark:data-[state=checked]:bg-green-500 dark:data-[state=checked]:border-green-500 dark:border-gray-600"
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                      >
                        {problem.id}. {problem.title}
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag, index) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={`text-xs ${getTagColor(index)} border-0`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className={`${getDifficultyColor(
                        problem.difficulty
                      )} border-0 font-medium`}
                    >
                      {problem.difficulty}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 dark:bg-gray-900 dark:border-gray-800"
                        >
                          <DropdownMenuItem className="dark:hover:bg-gray-800 dark:text-gray-200">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Problem
                          </DropdownMenuItem>
                          <DropdownMenuItem className="dark:hover:bg-gray-800 dark:text-gray-200">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Solution
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No problems found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ProblemsTable;
