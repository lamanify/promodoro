import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { Task } from "@/types/task";
import { useMemo } from "react";

interface ProductivityGraphProps {
  tasks: Task[];
}

const ProductivityGraph = ({ tasks }: ProductivityGraphProps) => {
  const data = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed && t.completedAt);
    const groupedByDay = completedTasks.reduce((acc, task) => {
      const day = new Date(task.completedAt!).toLocaleDateString();
      if (!acc[day]) {
        acc[day] = { completed: 0, breaks: 0 };
      }
      acc[day].completed += task.actualMinutes / 60;
      acc[day].breaks += (task.breakMinutes || 0) / 60;
      return acc;
    }, {} as Record<string, { completed: number; breaks: number }>);

    return Object.entries(groupedByDay).map(([day, values]) => ({
      name: day,
      completed: values.completed,
      breaks: values.breaks,
    }));
  }, [tasks]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Daily Productivity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => value.toFixed(1)} />
          <Legend />
          <Bar dataKey="completed" stackId="a" fill="#8884d8" name="Tasks Completed (hrs)" />
          <Bar dataKey="breaks" stackId="a" fill="#82ca9d" name="Breaks (hrs)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProductivityGraph;
