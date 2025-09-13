import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface SubmissionData {
  id: string;
  userId: string;
  problemId: string;
  sourceCode: string;
  language: string;
  stdin: string;
  stdout: string;
  stderr: string | null;
  compileOutput: string | null;
  status: string;
  memory: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

interface SubmissionHeatmapProps {
  submissions: SubmissionData[];
  isLoading?: boolean;
}

interface HeatmapValue {
  date: string;
  count: number;
}

const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({
  submissions,
  isLoading = false,
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapValue[]>([]);

  useEffect(() => {
    const dailyCounts: Record<string, number> = {};

    submissions.forEach((submission) => {
      const date = new Date(submission.createdAt);
      const dateKey = date.toISOString().split("T")[0];
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    });

    const dataArray: HeatmapValue[] = Object.entries(dailyCounts).map(
      ([date, count]) => ({
        date,
        count,
      })
    );

    setHeatmapData(dataArray);
  }, [submissions]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const totalSubmissions = submissions.length;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {totalSubmissions} submissions in the last year
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full overflow-x-auto p-2">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={heatmapData}
              classForValue={(value) => {
                if (!value || value.count === 0) {
                  return "color-empty";
                }
                if (value.count <= 3) return "color-github-1";
                if (value.count <= 6) return "color-github-2";
                if (value.count <= 9) return "color-github-3";
                return "color-github-4";
              }}
              showWeekdayLabels={true}
              showMonthLabels={true}
            />
          </div>

          <div className="flex justify-end">
            <div className="flex gap-1 items-center">
              <span>Less</span>
              <div className="w-3 h-3 bg-gray-100 rounded-sm" />
              <div className="w-3 h-3 bg-green-100 rounded-sm" />
              <div className="w-3 h-3 bg-green-300 rounded-sm" />
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <div className="w-3 h-3 bg-green-700 rounded-sm" />
              <span className="ml-2">More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionHeatmap;
