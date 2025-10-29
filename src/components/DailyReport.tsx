import { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface DailyReportProps {
  tasks: Task[];
}

export const DailyReport = ({ tasks }: DailyReportProps) => {
  const completedTasks = tasks.filter((t) => t.completed);
  const totalEstimatedMinutes = completedTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const totalActualMinutes = completedTasks.reduce((sum, t) => sum + t.actualMinutes, 0);
  
  const estimatedHours = (totalEstimatedMinutes / 60).toFixed(1);
  const actualHours = (totalActualMinutes / 60).toFixed(1);
  const accuracy = totalEstimatedMinutes > 0 
    ? ((totalActualMinutes / totalEstimatedMinutes) * 100).toFixed(0)
    : 0;

  const isOverEstimate = totalActualMinutes > totalEstimatedMinutes;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Today's Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Tasks Completed</span>
          </div>
          <div className="text-3xl font-bold text-success">{completedTasks.length}</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="h-4 w-4" />
            <span>Focus Time</span>
          </div>
          <div className="text-3xl font-bold text-primary">{actualHours}h</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            {isOverEstimate ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>Accuracy</span>
          </div>
          <div className={`text-3xl font-bold ${isOverEstimate ? 'text-destructive' : 'text-success'}`}>
            {accuracy}%
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Time:</span>
          <span className="font-medium">{estimatedHours}h</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Actual Time:</span>
          <span className="font-medium">{actualHours}h</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Difference:</span>
          <span className={`font-medium ${isOverEstimate ? 'text-destructive' : 'text-success'}`}>
            {isOverEstimate ? '+' : '-'}{Math.abs(totalActualMinutes - totalEstimatedMinutes / 60).toFixed(1)}h
          </span>
        </div>
      </div>
    </Card>
  );
};
