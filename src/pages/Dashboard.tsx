import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Task } from "@/types/task";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { FocusTimer, TimerMode } from "@/components/FocusTimer";
import { DailyReport } from "@/components/DailyReport";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BlitzPanel } from "@/components/BlitzPanel";

const CATEGORIES = ["Work", "Personal", "Learning", "Projects"];

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [timerMode, setTimerMode] = useState<TimerMode>("Pomodoro");
  const [isBlitzMode, setIsBlitzMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const formattedTasks = data.map((task: any) => ({
        ...task,
        estimatedMinutes: task.estimated_minutes,
        actualMinutes: task.actual_minutes,
        createdAt: task.created_at,
        completedAt: task.completed_at,
      }));
      setTasks(formattedTasks || []);
    }
  };

  const addTask = async (title: string, estimatedMinutes: number, category: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title,
        estimated_minutes: estimatedMinutes,
        category,
        user_id: user.id,
      })
      .select();

    if (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      const newTask = {
        ...data[0],
        estimatedMinutes: data[0].estimated_minutes,
        actualMinutes: data[0].actual_minutes,
        createdAt: data[0].created_at,
        completedAt: data[0].completed_at,
      };
      setTasks([newTask, ...tasks]);
      toast({
        title: "Task added",
        description: `"${title}" has been added to your list`,
      });
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedCompleted = !task.completed;
    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: updatedCompleted,
        completed_at: updatedCompleted ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      const updatedTask = {
        ...data[0],
        estimatedMinutes: data[0].estimated_minutes,
        actualMinutes: data[0].actual_minutes,
        createdAt: data[0].created_at,
        completedAt: data[0].completed_at,
      };
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      if (updatedCompleted) {
        toast({
          title: "Task completed! 🎉",
          description: `Great work on "${task.title}"`,
        });
      }
    }
  };

  const startTimer = (id: string) => {
    setActiveTaskId(id);
    const task = tasks.find((t) => t.id === id);
    toast({
      title: "Focus session started",
      description: `Working on "${task?.title}"`,
    });
  };

  const handleTimerComplete = async (taskId: string, minutesWorked: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newActualMinutes = task.actualMinutes + minutesWorked;
    const { data, error } = await supabase
      .from("tasks")
      .update({ actual_minutes: newActualMinutes })
      .eq("id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      const updatedTask = {
        ...data[0],
        estimatedMinutes: data[0].estimated_minutes,
        actualMinutes: data[0].actual_minutes,
        createdAt: data[0].created_at,
        completedAt: data[0].completed_at,
      };
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      toast({
        title: "Focus session complete! 🍅",
        description: `Added ${minutesWorked.toFixed(0)} minutes to "${task?.title}"`,
      });
    }
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Timer className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Promodoro</h1>
            </div>
            <p className="text-muted-foreground">Your daily task and focus coach</p>
          </div>
          <LogoutButton />
        </div>

        {/* Timer Mode Selector */}
        <div className="flex justify-center gap-2">
          <Button
            variant={timerMode === "Pomodoro" ? "default" : "outline"}
            onClick={() => setTimerMode("Pomodoro")}
          >
            Pomodoro
          </Button>
          <Button
            variant={timerMode === "EST" ? "default" : "outline"}
            onClick={() => setTimerMode("EST")}
          >
            EST Countdown
          </Button>
          <Button
            variant={timerMode === "Stopwatch" ? "default" : "outline"}
            onClick={() => setTimerMode("Stopwatch")}
          >
            Stopwatch
          </Button>
        </div>

        {/* Active Timer */}
        {activeTask && (
          <FocusTimer
            activeTask={activeTask}
            onTimerComplete={handleTimerComplete}
            onStop={() => setActiveTaskId(null)}
            mode={timerMode}
          />
        )}

        {/* Task Input */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Task</h2>
            <Button onClick={() => setIsBlitzMode(true)}>Blitz now</Button>
          </div>
          <TaskInput onAddTask={addTask} categories={CATEGORIES} />
        </div>

        {/* Tasks and Report */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <Link to="/reports" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              Time Spent
            </Link>
          </TabsList>
          
          <TabsContent value="active" className="space-y-3 mt-6">
            {activeTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No active tasks. Add one above to get started! 🚀
              </div>
            ) : (
              activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleComplete}
                  onStartTimer={startTimer}
                  isActiveTask={task.id === activeTaskId}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-6">
            {completedTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No completed tasks yet. Keep going! 💪
              </div>
            ) : (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleComplete}
                  onStartTimer={startTimer}
                  isActiveTask={false}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <DailyReport tasks={tasks} />
          </TabsContent>
        </Tabs>
      </div>
      {isBlitzMode && (
        <BlitzPanel
          tasks={activeTasks}
          onClose={() => setIsBlitzMode(false)}
          onTaskComplete={handleTimerComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;