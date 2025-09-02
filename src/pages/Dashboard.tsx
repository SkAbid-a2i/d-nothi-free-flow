import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Line
} from 'recharts';
import {
  ClipboardList,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for charts
const tasksByCategory = [
  { name: 'Documentation', value: 30, color: '#8b5cf6' },
  { name: 'Development', value: 25, color: '#06b6d4' },
  { name: 'Testing', value: 20, color: '#10b981' },
  { name: 'Support', value: 15, color: '#f59e0b' },
  { name: 'Meeting', value: 10, color: '#ef4444' }
];

const weeklyTasks = [
  { day: 'Mon', completed: 12, pending: 3 },
  { day: 'Tue', completed: 15, pending: 2 },
  { day: 'Wed', completed: 10, pending: 5 },
  { day: 'Thu', completed: 18, pending: 1 },
  { day: 'Fri', completed: 14, pending: 4 },
  { day: 'Sat', completed: 8, pending: 2 },
  { day: 'Sun', completed: 5, pending: 1 }
];

const monthlyProgress = [
  { month: 'Jan', tasks: 120 },
  { month: 'Feb', tasks: 135 },
  { month: 'Mar', tasks: 128 },
  { month: 'Apr', tasks: 142 },
  { month: 'May', tasks: 158 },
  { month: 'Jun', tasks: 165 }
];

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const isAdminOrSupervisor = user?.role === 'systemadmin' || user?.role === 'admin' || user?.role === 'supervisor';

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    color = 'primary',
    trend 
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    color?: string;
    trend?: number;
  }) => (
    <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && (
            <Badge variant={trend > 0 ? "default" : "secondary"} className="ml-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.welcome')}, {user?.fullName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <Button asChild className="bg-gradient-accent hover:opacity-90">
          <Link to="/task-logger">
            <Plus className="w-4 h-4 mr-2" />
            {t('tasks.newTask')}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.todayTasks')}
          value="12"
          description="3 pending"
          icon={ClipboardList}
          color="primary"
          trend={8}
        />
        <StatCard
          title={t('dashboard.weekTasks')}
          value="87"
          description="5 pending"
          icon={CheckCircle}
          color="success"
          trend={15}
        />
        <StatCard
          title={t('dashboard.pendingLeaves')}
          value="3"
          description={isAdminOrSupervisor ? "Team requests" : "Your requests"}
          icon={Calendar}
          color="warning"
        />
        <StatCard
          title={isAdminOrSupervisor ? "Team Members" : "Your Productivity"}
          value={isAdminOrSupervisor ? "24" : "94%"}
          description={isAdminOrSupervisor ? "Active users" : "This month"}
          icon={Users}
          color="accent"
          trend={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Task Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>{t('dashboard.tasksSummary')}</CardTitle>
            <CardDescription>Tasks completed vs pending this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTasks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--primary))" />
                <Bar dataKey="pending" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>{t('dashboard.tasksByCategory')}</CardTitle>
            <CardDescription>Distribution of tasks by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasksByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tasksByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {tasksByCategory.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Progress */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Task completion trend over the months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions & Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-success mt-1" />
              <div className="text-sm">
                <p className="font-medium">Task completed</p>
                <p className="text-muted-foreground">Website deployment - 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-warning mt-1" />
              <div className="text-sm">
                <p className="font-medium">Leave request pending</p>
                <p className="text-muted-foreground">Annual leave - 1 day ago</p>
              </div>
            </div>

            {isAdminOrSupervisor && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-destructive mt-1" />
                <div className="text-sm">
                  <p className="font-medium">3 pending approvals</p>
                  <p className="text-muted-foreground">Leave requests require action</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};