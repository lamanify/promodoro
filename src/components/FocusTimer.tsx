import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipForward, Coffee, ExternalLink } from "lucide-react";
import { Task } from "@/types/task";

interface FocusTimerProps {
  activeTask: Task | null;
  onTimerComplete: (taskId: string, minutesWorked: number) => void;
  onStop: () => void;
}

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export const FocusTimer = ({ activeTask, onTimerComplete, onStop }: FocusTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    if (isBreak) {
      // Break complete, start new work session
      setIsBreak(false);
      setTimeLeft(WORK_DURATION);
      setIsRunning(false);
    } else {
      // Work session complete
      if (activeTask && sessionStartTime) {
        const minutesWorked = (accumulatedSeconds + WORK_DURATION) / 60;
        onTimerComplete(activeTask.id, minutesWorked);
        setAccumulatedSeconds(0);
        setSessionStartTime(null);
      }
      // Start break
      setIsBreak(true);
      setTimeLeft(BREAK_DURATION);
      setIsRunning(true);
    }
  };

  const toggleTimer = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const skipSession = () => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(WORK_DURATION);
      setIsRunning(false);
    } else {
      if (activeTask && sessionStartTime) {
        const elapsedSeconds = WORK_DURATION - timeLeft + accumulatedSeconds;
        const minutesWorked = elapsedSeconds / 60;
        onTimerComplete(activeTask.id, minutesWorked);
        setAccumulatedSeconds(0);
        setSessionStartTime(null);
      }
      onStop();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!activeTask) return null;

  return (
    <Card className="p-8 border-primary/30 focus-glow">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          {isBreak ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <Coffee className="h-5 w-5" />
              <span className="text-sm font-medium">Break Time</span>
            </div>
          ) : (
            <h2 className="text-2xl font-semibold text-foreground truncate">{activeTask.title}</h2>
          )}
        </div>

        <div className="relative">
          <div className="text-7xl font-bold text-primary tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {isBreak ? "Take a break" : "Focus time"}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="bg-primary hover:bg-primary/90 px-8"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={skipSession}
            size="lg"
            variant="outline"
            className="border-border"
          >
            <SkipForward className="h-5 w-5 mr-2" />
            {isBreak ? "Skip Break" : "End Session"}
          </Button>
            <Button
                onClick={() => {
                const url = `/timer-popup?taskId=${activeTask.id}&taskTitle=${encodeURIComponent(
                    activeTask.title
                )}&time=${timeLeft}&running=${isRunning}&break=${isBreak}`;
                window.open(url, "Timer", "width=400,height=400");
                onStop();
                }}
                size="lg"
                variant="outline"
            >
                <ExternalLink className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </Card>
  );
};
