import React, { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { X, Zap, Play, Pause, SkipForward, Check } from "lucide-react";

interface BlitzPanelProps {
  tasks: Task[];
  onClose: () => void;
  onTaskComplete: (taskId: string, minutesWorked: number) => void;
}

const WORK_DURATION = 25 * 60; // 25 minutes

export const BlitzPanel: React.FC<BlitzPanelProps> = ({ tasks, onClose, onTaskComplete }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(true);

  const currentTask = tasks[currentTaskIndex];

  useEffect(() => {
    if (!currentTask) {
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    setTimeLeft(WORK_DURATION);
  }, [currentTask]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = (skipped = false) => {
    const minutesWorked = (WORK_DURATION - timeLeft) / 60;
    if (!skipped) {
      onTaskComplete(currentTask.id, minutesWorked);
    }

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      setIsRunning(false);
      // Optional: Add a success screen or auto-close
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const skipTask = () => handleSessionComplete(true);

  const completeTaskManually = () => {
    handleSessionComplete();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-card border rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Blitz Mode</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {currentTask ? (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold truncate">{currentTask.title}</h3>
            <div className="text-6xl font-bold text-primary tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>

            <div className="flex justify-center gap-3">
              <Button onClick={toggleTimer} size="lg">
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button onClick={skipTask} size="lg" variant="outline">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button onClick={completeTaskManually} size="lg" variant="outline" className="bg-success/20 hover:bg-success/30">
                <Check className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold">All tasks completed! 🎉</h3>
            <p className="text-muted-foreground mt-2">Great work!</p>
          </div>
        )}

        <div className="mt-8 space-y-3 max-h-60 overflow-y-auto">
          {tasks.map((task, index) => (
             <div
                key={task.id}
                className={`p-3 rounded-md transition-all ${
                  index === currentTaskIndex
                    ? 'bg-primary/20'
                    : 'bg-secondary opacity-50'
                }`}
              >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
