import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, Coffee } from "lucide-react";

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const TimerPopupPage = () => {
  const [searchParams] = useSearchParams();

  const initialTime = parseInt(searchParams.get("time") || `${WORK_DURATION}`, 10);
  const initialRunning = searchParams.get("running") === "true";
  const initialBreak = searchParams.get("break") === "true";
  const taskTitle = searchParams.get("taskTitle") || "Focus Time";

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(initialRunning);
  const [isBreak, setIsBreak] = useState(initialBreak);

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
      setIsBreak(false);
      setTimeLeft(WORK_DURATION);
      setIsRunning(false);
    } else {
      setIsBreak(true);
      setTimeLeft(BREAK_DURATION);
      setIsRunning(true);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const skipSession = () => {
    if (isBreak) {
        setIsBreak(false);
        setTimeLeft(WORK_DURATION);
        setIsRunning(false);
      } else {
        window.close();
      }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="p-8 border-primary/30 focus-glow w-full max-w-md">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            {isBreak ? (
               <div className="flex items-center justify-center gap-2 text-success">
                 <Coffee className="h-5 w-5" />
                 <span className="text-sm font-medium">Break Time</span>
               </div>
             ) : (
              <h2 className="text-2xl font-semibold text-foreground truncate">{taskTitle}</h2>
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TimerPopupPage;
