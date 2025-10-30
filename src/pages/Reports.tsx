import React, { useEffect, useState } from 'react';
import { calculateTimeSpent } from '../lib/TimeUtils';
import { Task } from '@/types/task';

const STORAGE_KEY = 'promodoro-tasks';

const Reports: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allTasks: Task[] = JSON.parse(stored);
      setCompletedTasks(allTasks.filter(task => task.completed && task.completedAt));
    }
  }, []);

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Time Spent Report</h1>
      <div className="space-y-4">
        {completedTasks.length > 0 ? (
          completedTasks.map(task => (
            <div key={task.id} className="bg-card shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
              <p><strong>Start Time:</strong> {new Date(task.createdAt).toLocaleString()}</p>
              <p><strong>End Time:</strong> {new Date(task.completedAt!).toLocaleString()}</p>
              <p><strong>Time Spent:</strong> {calculateTimeSpent(new Date(task.createdAt), new Date(task.completedAt!))}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No completed tasks to report yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
