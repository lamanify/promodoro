import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { FocusTimer } from "@/components/FocusTimer";
import LogoutButton from "@/components/LogoutButton";
import { DailyReport } from "@/components/DailyReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = ["Work", "Personal", "Learning", "Projects"];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
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

        {/* Active Timer */}
        {activeTask && (
          <FocusTimer
            activeTask={activeTask}
            onTimerComplete={handleTimerComplete}
            onStop={() => setActiveTaskId(null)}
          />
        )}

        {/* Task Input */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <TaskInput onAddTask={addTask} categories={CATEGORIES} />
        </div>

        {/* Tasks and Report */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
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
    </div>
  );
};

export default Index;
