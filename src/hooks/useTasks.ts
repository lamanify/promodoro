import { useState, useEffect } from "react";
import { Task } from "@/types/task";

const STORAGE_KEY = "promodoro-tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  return tasks;
};
