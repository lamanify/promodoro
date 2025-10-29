export interface Task {
  id: string;
  title: string;
  estimatedMinutes: number;
  actualMinutes: number;
  completed: boolean;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface TimerSession {
  taskId: string;
  startTime: number;
  pausedTime?: number;
  accumulatedMinutes: number;
}
