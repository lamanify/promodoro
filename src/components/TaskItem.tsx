import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Play, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onStartTimer: (id: string) => void;
  isActiveTask: boolean;
}

export const TaskItem = ({ task, onToggleComplete, onStartTimer, isActiveTask }: TaskItemProps) => {
  const estimatedHours = (task.estimatedMinutes / 60).toFixed(1);
  const actualHours = (task.actualMinutes / 60).toFixed(1);

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-lg border bg-card transition-all",
        isActiveTask && "border-primary focus-glow",
        task.completed && "opacity-60"
      )}
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        className="flex-shrink-0 transition-transform hover:scale-110"
      >
        {task.completed ? (
          <CheckCircle2 className="h-6 w-6 text-success" />
        ) : (
          <Circle className="h-6 w-6 text-muted-foreground" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={cn("font-medium truncate", task.completed && "line-through text-muted-foreground")}>
          {task.title}
        </h3>
        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Est: {estimatedHours}h
          </span>
          {task.actualMinutes > 0 && (
            <span className={cn(
              "flex items-center gap-1",
              task.completed && task.actualMinutes > task.estimatedMinutes && "text-destructive",
              task.completed && task.actualMinutes <= task.estimatedMinutes && "text-success"
            )}>
              Actual: {actualHours}h
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{task.category}</span>
        </div>
      </div>

      {!task.completed && !isActiveTask && (
        <Button
          onClick={() => onStartTimer(task.id)}
          size="sm"
          variant="outline"
          className="flex-shrink-0 border-primary/30 hover:bg-primary/10"
        >
          <Play className="h-4 w-4 mr-1" />
          Start
        </Button>
      )}
    </div>
  );
};
