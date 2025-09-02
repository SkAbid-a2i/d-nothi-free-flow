import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  User,
  CalendarDays,
  AlertCircle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const leaveTypes = [
  { id: 'annual', name: 'Annual Leave', balance: 15 },
  { id: 'sick', name: 'Sick Leave', balance: 10 },
  { id: 'casual', name: 'Casual Leave', balance: 5 },
  { id: 'maternity', name: 'Maternity Leave', balance: 120 },
  { id: 'paternity', name: 'Paternity Leave', balance: 7 }
];

// Mock leave data
const mockLeaves = [
  {
    id: '1',
    type: 'annual',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    days: 3,
    reason: 'Family vacation',
    status: 'approved',
    appliedDate: '2024-01-10',
    approvedBy: 'Manager Smith',
    approvedDate: '2024-01-12'
  },
  {
    id: '2',
    type: 'sick',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    days: 1,
    reason: 'Fever and cold symptoms',
    status: 'pending',
    appliedDate: '2024-01-14',
    approvedBy: null,
    approvedDate: null
  },
  {
    id: '3',
    type: 'casual',
    startDate: '2024-01-08',
    endDate: '2024-01-09',
    days: 2,
    reason: 'Personal work',
    status: 'rejected',
    appliedDate: '2024-01-05',
    approvedBy: 'Manager Smith',
    approvedDate: '2024-01-07',
    rejectionReason: 'Insufficient notice period'
  }
];

const statusColors = {
  pending: 'secondary',
  approved: 'outline',
  rejected: 'destructive'
} as const;

const statusIcons = {
  pending: Clock,
  approved: Check,
  rejected: X
};

export const LeaveManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAdminOrSupervisor = user?.role === 'systemadmin' || user?.role === 'admin' || user?.role === 'supervisor';

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    return differenceInDays(new Date(end), new Date(start)) + 1;
  };

  const selectedLeaveType = leaveTypes.find(type => type.id === formData.type);
  const requestedDays = calculateDays(formData.startDate, formData.endDate);
  const hasEnoughBalance = selectedLeaveType ? requestedDays <= selectedLeaveType.balance : true;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasEnoughBalance) {
      toast({
        title: t('common.error'),
        description: 'Insufficient leave balance',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t('common.success'),
        description: 'Leave request submitted successfully!',
      });

      setIsDialogOpen(false);
      setFormData({ type: '', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to submit leave request',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (leaveId: string, action: 'approve' | 'reject') => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('common.success'),
        description: `Leave request ${action}d successfully!`,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: `Failed to ${action} leave request`,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <Badge variant={statusColors[status as keyof typeof statusColors]}>
        <Icon className="w-3 h-3 mr-1" />
        {t(`leaves.${status}`)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('nav.leaves')}</h1>
          <p className="text-muted-foreground">
            {isAdminOrSupervisor ? 'Manage team leave requests' : 'Manage your leave requests and view balance'}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-accent hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              {t('leaves.newLeave')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('leaves.newLeave')}</DialogTitle>
              <DialogDescription>
                Fill out the form to request leave
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">{t('leaves.leaveType')}</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{type.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {type.balance} days available
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('leaves.startDate')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('leaves.endDate')}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate}
                    required
                  />
                </div>
              </div>

              {requestedDays > 0 && (
                <div className={`p-3 rounded-lg ${hasEnoughBalance ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                  <div className="flex items-center gap-2 text-sm">
                    {hasEnoughBalance ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{requestedDays} days requested</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Insufficient balance ({requestedDays} days requested, {selectedLeaveType?.balance || 0} available)</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">{t('leaves.reason')}</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Please provide a reason for your leave..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !hasEnoughBalance}
                  className="bg-gradient-accent hover:opacity-90"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('leaves.requestLeave')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {leaveTypes.map((type) => (
          <Card key={type.id} className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{type.name}</p>
                  <p className="text-2xl font-bold">{type.balance}</p>
                  <p className="text-xs text-muted-foreground">days available</p>
                </div>
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave History */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {isAdminOrSupervisor ? 'Team Leave Requests' : t('leaves.leaveHistory')}
          </CardTitle>
          <CardDescription>
            {isAdminOrSupervisor ? 'Review and manage team leave requests' : 'Your leave request history and status'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdminOrSupervisor && <TableHead>Employee</TableHead>}
                <TableHead>Leave Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {isAdminOrSupervisor && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaves.map((leave) => (
                <TableRow key={leave.id} className="hover:bg-muted/50">
                  {isAdminOrSupervisor && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>John Doe</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="outline">
                      {leaveTypes.find(type => type.id === leave.type)?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(new Date(leave.startDate), 'MMM dd, yyyy')}</div>
                      {leave.startDate !== leave.endDate && (
                        <div className="text-muted-foreground">
                          to {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{leave.days}</span>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={leave.reason}>
                      {leave.reason}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(leave.status)}
                  </TableCell>
                  {isAdminOrSupervisor && (
                    <TableCell>
                      {leave.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleApproval(leave.id, 'approve')}
                            className="text-success hover:text-success"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleApproval(leave.id, 'reject')}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {mockLeaves.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t('common.noData')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};