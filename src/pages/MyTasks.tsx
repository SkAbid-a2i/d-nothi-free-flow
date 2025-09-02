import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Mock task data
const mockTasks = [
  {
    id: '1',
    dateTime: '2024-01-15T09:30:00',
    source: 'Phone Call',
    category: 'Customer Service',
    service: 'Complaint Resolution',
    userInfo: 'CUST001 - +880123456789',
    office: 'Head Office - Dhaka',
    description: 'Customer complaint about delayed service delivery. Investigated and provided solution.',
    status: 'completed',
    comment: 'Resolved with full customer satisfaction',
    attachments: ['complaint-report.pdf'],
    createdBy: 'John Doe'
  },
  {
    id: '2',
    dateTime: '2024-01-15T14:15:00',
    source: 'Email',
    category: 'Technical Support',
    service: 'Software Issue',
    userInfo: 'support@company.com',
    office: 'Head Office - Dhaka',
    description: 'Software bug reported in the dashboard module. Needs investigation.',
    status: 'pending',
    comment: 'Waiting for development team response',
    attachments: ['screenshot.png', 'error-log.txt'],
    createdBy: 'John Doe'
  },
  {
    id: '3',
    dateTime: '2024-01-14T11:45:00',
    source: 'Walk-in',
    category: 'Sales',
    service: 'Product Inquiry',
    userInfo: 'LEAD001 - John Smith',
    office: 'Branch Office - Chittagong',
    description: 'Potential customer interested in premium package. Provided detailed information.',
    status: 'inProgress',
    comment: 'Follow-up scheduled for tomorrow',
    attachments: ['brochure.pdf'],
    createdBy: 'John Doe'
  },
  // Add more mock data...
];

const statusColors = {
  pending: 'secondary',
  inProgress: 'default',
  completed: 'outline'
} as const;

const statusIcons = {
  pending: AlertCircle,
  inProgress: Clock,
  completed: CheckCircle
};

export const MyTasks = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.userInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    // Date filtering logic would go here
    const matchesDate = true;

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <Badge variant={statusColors[status as keyof typeof statusColors]}>
        <Icon className="w-3 h-3 mr-1" />
        {t(`tasks.${status}`)}
      </Badge>
    );
  };

  const exportTasks = () => {
    // Mock CSV export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Source,Category,Service,User Info,Status,Description\n" +
      filteredTasks.map(task => 
        `${format(new Date(task.dateTime), 'yyyy-MM-dd HH:mm')},${task.source},${task.category},${task.service},"${task.userInfo}",${task.status},"${task.description}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `my-tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('nav.myTasks')}</h1>
          <p className="text-muted-foreground">
            View and manage your task history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportTasks}>
            <Download className="w-4 h-4 mr-2" />
            {t('tasks.exportTasks')}
          </Button>
          <Button asChild className="bg-gradient-accent hover:opacity-90">
            <Link to="/task-logger">
              <Clock className="w-4 h-4 mr-2" />
              {t('tasks.newTask')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('tasks.searchTasks')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">{t('tasks.pending')}</SelectItem>
                <SelectItem value="inProgress">{t('tasks.inProgress')}</SelectItem>
                <SelectItem value="completed">{t('tasks.completed')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Technical Support">Technical Support</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.filterByDate')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task History</CardTitle>
              <CardDescription>
                {filteredTasks.length} tasks found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>User Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">
                    <div>
                      <div>{format(new Date(task.dateTime), 'MMM dd, yyyy')}</div>
                      <div className="text-muted-foreground text-xs">
                        {format(new Date(task.dateTime), 'HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.category}</div>
                      <div className="text-sm text-muted-foreground">{task.service}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="truncate" title={task.userInfo}>
                      {task.userInfo}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.status)}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={task.description}>
                      {task.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t('common.noData')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};