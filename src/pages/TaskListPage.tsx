import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "@/types/task";

const TASK_LIST_STORAGE_KEY = "blitzit-tasks";

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(30);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(TASK_LIST_STORAGE_KEY);
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      // Set initial default tasks if nothing is stored
      setTasks([
        { id: '1', title: 'Implement task list', estimatedMinutes: 60, actualMinutes: 15, completed: false, category: "Work", createdAt: new Date().toISOString() },
        { id: '2', title: 'Add styling', estimatedMinutes: 30, actualMinutes: 0, completed: false, category: "Work", createdAt: new Date().toISOString() },
        { id: '3', title: 'Deploy to production', estimatedMinutes: 120, actualMinutes: 0, completed: true, category: "Work", createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
      ]);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(TASK_LIST_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;
    const newTask: Task = {
      id: String(Date.now()),
      title: newTaskTitle,
      estimatedMinutes: newTaskTime,
      actualMinutes: 0,
      completed: false,
      category: "Work", // Default category
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskTime(30); // Reset time to default
  };

  const handleToggleDone = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : undefined } : task
    ));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Blitzit Style Task List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 p-4 bg-card rounded-lg border">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new task..."
                className="flex-grow"
              />
              <Input
                type="number"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(Number(e.target.value))}
                className="w-24"
                min="1"
              />
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-3 mt-4">
                {activeTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-md border bg-card">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleDone(task.id)}
                    />
                    <label htmlFor={`task-${task.id}`} className="flex-grow font-medium">
                      {task.title}
                    </label>
                    <div className="text-sm text-muted-foreground">
                      {task.actualMinutes} / {task.estimatedMinutes} min
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="completed" className="space-y-3 mt-4">
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-md border bg-card">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleDone(task.id)}
                    />
                    <label htmlFor={`task-${task.id}`} className="flex-grow font-medium line-through text-muted-foreground">
                      {task.title}
                    </label>
                    <div className="text-sm text-muted-foreground">
                      {task.actualMinutes} / {task.estimatedMinutes} min
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskListPage;
