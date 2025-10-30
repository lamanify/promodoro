import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { FocusTimer } from "@/components/FocusTimer";
import { DailyReport } from "@/components/DailyReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "promodoro-tasks";
const CATEGORIES = ["Work", "Personal", "Learning", "Projects"];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, estimatedMinutes: number, category: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      estimatedMinutes,
      actualMinutes: 0,
      completed: false,
      category,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    toast({
      title: "Task added",
      description: `"${title}" has been added to your list`,
    });
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    );
    
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      toast({
        title: "Task completed! 🎉",
        description: `Great work on "${task.title}"`,
      });
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

  const handleTimerComplete = (taskId: string, minutesWorked: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, actualMinutes: task.actualMinutes + minutesWorked }
          : task
      )
    );
    
    const task = tasks.find((t) => t.id === taskId);
    toast({
      title: "Focus session complete! 🍅",
      description: `Added ${minutesWorked.toFixed(0)} minutes to "${task?.title}"`,
    });
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Timer className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Promodoro</h1>
            <Link to="/tasks" className="text-sm text-muted-foreground hover:text-primary">
              Task List
            </Link>
          </div>
          <p className="text-muted-foreground">Your daily task and focus coach</p>
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
