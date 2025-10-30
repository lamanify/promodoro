import { Card } from "@/components/ui/card";
import { Task } from "@/types/task";
import { useMemo } from "react";

interface ProductivityStatsProps {
  tasks: Task[];
}

const ProductivityStats = ({ tasks }: ProductivityStatsProps) => {
  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed);
    const totalTasksDone = completedTasks.length;
    const totalMinutesWorked = completedTasks.reduce((sum, t) => sum + t.actualMinutes, 0);
    const totalHoursWorked = (totalMinutesWorked / 60).toFixed(1);
    const avgTimePerTask = totalTasksDone > 0 ? (totalMinutesWorked / totalTasksDone).toFixed(0) : 0;

    const workDays = new Set(
      completedTasks.map((t) => new Date(t.completedAt!).toLocaleDateString())
    ).size;

    return {
      totalWorkDays: workDays,
      totalTasksDone,
      totalHoursWorked,
      avgTimePerTask: `${avgTimePerTask}m`,
    };
  }, [tasks]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Work Days</p>
          <p className="text-2xl font-bold">{stats.totalWorkDays}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Tasks Done</p>
          <p className="text-2xl font-bold">{stats.totalTasksDone}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Hrs Worked</p>
          <p className="text-2xl font-bold">{stats.totalHoursWorked}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Avg. Time Per Task</p>
          <p className="text-2xl font-bold">{stats.avgTimePerTask}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProductivityStats;
