import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipForward, Coffee, Timer } from "lucide-react";
import { Task } from "@/types/task";

export type TimerMode = "Pomodoro" | "EST" | "Stopwatch";

interface FocusTimerProps {
  activeTask: Task | null;
  onTimerComplete: (taskId: string, minutesWorked: number) => void;
  onStop: () => void;
  mode: TimerMode;
}

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export const FocusTimer = ({
  activeTask,
  onTimerComplete,
  onStop,
  mode,
}: FocusTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(
    null
  );
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);

  useEffect(() => {
    // Reset state when the active task or mode changes
    setIsRunning(false);
    setIsBreak(false);
    setAccumulatedSeconds(0);
    setSessionStartTime(null);

    if (mode === "Pomodoro") {
      setTimeLeft(WORK_DURATION);
    } else if (mode === "EST" && activeTask) {
      setTimeLeft(activeTask.estimatedMinutes * 60);
    } else if (mode === "Stopwatch") {
      setTimeLeft(0);
      setTimeElapsed(0);
    }
  }, [activeTask, mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === "Stopwatch") {
          setTimeElapsed((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    if (mode === "Pomodoro") {
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
    } else if (mode === "EST") {
      if (activeTask) {
        const minutesWorked = activeTask.estimatedMinutes;
        onTimerComplete(activeTask.id, minutesWorked);
      }
      onStop();
    }
  };

  const toggleTimer = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    if (activeTask && sessionStartTime) {
      let elapsedSeconds;
      if (mode === "Stopwatch") {
        elapsedSeconds = timeElapsed;
      } else if (mode === "EST") {
        elapsedSeconds = (activeTask.estimatedMinutes * 60) - timeLeft;
      } else { // Pomodoro
        elapsedSeconds = WORK_DURATION - timeLeft;
      }

      const minutesWorked = (elapsedSeconds + accumulatedSeconds) / 60;
      onTimerComplete(activeTask.id, minutesWorked);
      setAccumulatedSeconds(0);
      setSessionStartTime(null);
    }
    onStop();
  };

  const displayTime = mode === "Stopwatch" ? timeElapsed : timeLeft;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

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
            <h2 className="text-2xl font-semibold text-foreground truncate">
              {activeTask.title}
            </h2>
          )}
        </div>

        <div className="relative">
          <div className="text-7xl font-bold text-primary tabular-nums">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {isBreak
              ? "Take a break"
              : mode === "Pomodoro"
              ? "Focus time"
              : mode === "EST"
              ? "Countdown"
              : "Time tracker"}
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
            onClick={stopTimer}
            size="lg"
            variant="outline"
            className="border-border"
          >
            <SkipForward className="h-5 w-5 mr-2" />
            {isBreak ? "Skip Break" : "End Session"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
