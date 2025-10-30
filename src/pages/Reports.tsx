import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type TimeRange = 'today' | 'week' | 'month';

const CATEGORY_COLORS: { [key: string]: string } = {
  Work: '#3b82f6',
  Personal: '#10b981',
  Learning: '#f59e0b',
  Projects: '#8b5cf6',
};

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, timeRange]);

  const getDateRange = () => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (timeRange) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
    }

    return { start, end };
  };

  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);

    const { start, end } = getDateRange();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('completed_at', start.toISOString())
      .lte('completed_at', end.toISOString())
      .eq('completed', true)
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      const formattedTasks = (data || []).map((task: any) => ({
        ...task,
        estimatedMinutes: task.estimated_minutes,
        actualMinutes: task.actual_minutes,
        createdAt: task.created_at,
        completedAt: task.completed_at,
      }));
      setTasks(formattedTasks);
    }
    setLoading(false);
  };

  const completedTasks = tasks.filter((t) => t.completed);
  const totalTasksCompleted = completedTasks.length;
  const totalEstimatedMinutes = completedTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const totalActualMinutes = completedTasks.reduce((sum, t) => sum + t.actualMinutes, 0);
  const averageSessionTime = totalTasksCompleted > 0 ? totalActualMinutes / totalTasksCompleted : 0;
  const accuracy = totalEstimatedMinutes > 0
    ? ((totalActualMinutes / totalEstimatedMinutes) * 100).toFixed(0)
    : 0;

  // Category breakdown
  const categoryData = Object.entries(
    completedTasks.reduce((acc, task) => {
      const category = task.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = {
          name: category,
          tasks: 0,
          minutes: 0,
          estimated: 0
        };
      }
      acc[category].tasks += 1;
      acc[category].minutes += task.actualMinutes;
      acc[category].estimated += task.estimatedMinutes;
      return acc;
    }, {} as Record<string, { name: string; tasks: number; minutes: number; estimated: number }>)
  ).map(([_, data]) => data);

  // Daily breakdown (for week/month views)
  const getDailyData = () => {
    const dailyMap = new Map<string, { date: string; tasks: number; minutes: number; estimated: number }>();

    completedTasks.forEach(task => {
      const date = format(new Date(task.completedAt!), 'MMM dd');
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, tasks: 0, minutes: 0, estimated: 0 });
      }
      const entry = dailyMap.get(date)!;
      entry.tasks += 1;
      entry.minutes += task.actualMinutes;
      entry.estimated += task.estimatedMinutes;
    });

    return Array.from(dailyMap.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const dailyData = getDailyData();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view reports.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Productivity Report
              </h1>
              <p className="text-muted-foreground">Track your progress and insights</p>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'today' ? 'default' : 'outline'}
            onClick={() => setTimeRange('today')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Today
          </Button>
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            This Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            This Month
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading report data...
          </div>
        ) : completedTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No completed tasks yet</h3>
            <p className="text-muted-foreground mb-4">
              Start completing tasks to see your productivity insights!
            </p>
            <Link to="/">
              <Button>Go to Dashboard</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Tasks Completed</span>
                </div>
                <div className="text-3xl font-bold text-success">{totalTasksCompleted}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Total Focus Time</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {(totalActualMinutes / 60).toFixed(1)}h
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Target className="h-4 w-4" />
                  <span>Avg Session</span>
                </div>
                <div className="text-3xl font-bold text-blue-500">
                  {averageSessionTime.toFixed(0)}m
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Time Accuracy</span>
                </div>
                <div className={`text-3xl font-bold ${totalActualMinutes > totalEstimatedMinutes ? 'text-destructive' : 'text-success'}`}>
                  {accuracy}%
                </div>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="categories">By Category</TabsTrigger>
                <TabsTrigger value="details">Task Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {timeRange !== 'today' && dailyData.length > 1 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Daily Progress</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="tasks"
                          stroke="#3b82f6"
                          name="Tasks Completed"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="minutes"
                          stroke="#10b981"
                          name="Minutes Worked"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Time: Estimated vs Actual</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estimated Time</span>
                      <span className="font-semibold">{(totalEstimatedMinutes / 60).toFixed(1)}h</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Actual Time</span>
                      <span className="font-semibold">{(totalActualMinutes / 60).toFixed(1)}h</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          totalActualMinutes > totalEstimatedMinutes ? 'bg-destructive' : 'bg-success'
                        }`}
                        style={{
                          width: totalEstimatedMinutes > 0
                            ? `${Math.min((totalActualMinutes / totalEstimatedMinutes) * 100, 100)}%`
                            : '0%'
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">Difference</span>
                      <span className={`font-semibold ${
                        totalActualMinutes > totalEstimatedMinutes ? 'text-destructive' : 'text-success'
                      }`}>
                        {totalActualMinutes > totalEstimatedMinutes ? '+' : '-'}
                        {Math.abs(totalActualMinutes - totalEstimatedMinutes).toFixed(0)} minutes
                      </span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Tasks by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="tasks"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CATEGORY_COLORS[entry.name] || '#6b7280'}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Time by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="minutes" fill="#3b82f6" name="Actual (min)" />
                        <Bar dataKey="estimated" fill="#10b981" name="Estimated (min)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Category Summary</h3>
                  <div className="space-y-4">
                    {categoryData.map((category) => (
                      <div key={category.name} className="border-b border-border pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: CATEGORY_COLORS[category.name] || '#6b7280' }}
                            />
                            <span className="font-semibold">{category.name}</span>
                          </div>
                          <span className="text-muted-foreground">{category.tasks} tasks</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 ml-6">
                          <div>
                            <span className="text-sm text-muted-foreground">Actual Time:</span>
                            <span className="ml-2 font-medium">{(category.minutes / 60).toFixed(1)}h</span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Estimated:</span>
                            <span className="ml-2 font-medium">{(category.estimated / 60).toFixed(1)}h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Completed Tasks</h3>
                  <div className="space-y-3">
                    {completedTasks.map((task) => (
                      <div key={task.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold flex items-center gap-2">
                              {task.title}
                              {task.category && (
                                <span
                                  className="text-xs px-2 py-1 rounded"
                                  style={{
                                    backgroundColor: `${CATEGORY_COLORS[task.category] || '#6b7280'}20`,
                                    color: CATEGORY_COLORS[task.category] || '#6b7280'
                                  }}
                                >
                                  {task.category}
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Completed: {new Date(task.completedAt!).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Estimated:</span>
                            <span className="ml-2 font-medium">{task.estimatedMinutes}m</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Actual:</span>
                            <span className="ml-2 font-medium">{task.actualMinutes}m</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Difference:</span>
                            <span className={`ml-2 font-medium ${
                              task.actualMinutes > task.estimatedMinutes ? 'text-destructive' : 'text-success'
                            }`}>
                              {task.actualMinutes > task.estimatedMinutes ? '+' : ''}
                              {task.actualMinutes - task.estimatedMinutes}m
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
