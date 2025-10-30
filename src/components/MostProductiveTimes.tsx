import { Card } from "@/components/ui/card";
import { Task } from "@/types/task";
import { useMemo } from "react";
import { format } from "date-fns";

interface MostProductiveTimesProps {
  tasks: Task[];
}

const MostProductiveTimes = ({ tasks }: MostProductiveTimesProps) => {
  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed && t.completedAt);

    const findMostFrequent = (arr: string[]) => {
      if (arr.length === 0) return "N/A";
      return arr.reduce(
        (acc, val) => {
          acc.store[val] = (acc.store[val] || 0) + 1;
          if (acc.store[val] > acc.max) {
            acc.max = acc.store[val];
            acc.result = val;
          }
          return acc;
        },
        { store: {} as Record<string, number>, max: 0, result: "N/A" }
      ).result;
    };

    const hours = completedTasks.map((t) => t.completedAt ? format(new Date(t.completedAt), "H") : "");
    const mostProductiveHourRaw = findMostFrequent(hours);
    const mostProductiveHour = mostProductiveHourRaw !== "N/A"
        ? `${mostProductiveHourRaw}:00 - ${parseInt(mostProductiveHourRaw) + 1}:00`
        : "N/A";

    return {
      mostProductiveHour,
      mostProductiveDay: findMostFrequent(
        completedTasks.map((t) => t.completedAt ? format(new Date(t.completedAt), "EEEE") : "")
      ),
      mostProductiveMonth: findMostFrequent(
        completedTasks.map((t) => t.completedAt ? format(new Date(t.completedAt), "MMMM") : "")
      ),
    };
  }, [tasks]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Most Productive Times</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Most Productive Hour</p>
          <p className="text-2xl font-bold">{stats.mostProductiveHour}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Most Productive Day</p>
          <p className="text-2xl font-bold">{stats.mostProductiveDay}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Most Productive Month</p>
          <p className="text-2xl font-bold">{stats.mostProductiveMonth}</p>
        </div>
      </div>
    </Card>
  );
};

export default MostProductiveTimes;
