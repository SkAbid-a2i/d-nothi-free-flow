import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Upload, Save, X } from 'lucide-react';
import { format } from 'date-fns';

// Mock dropdown data - replace with actual backend data
const mockSources = [
  { id: '1', name: 'Phone Call' },
  { id: '2', name: 'Email' },
  { id: '3', name: 'Walk-in' },
  { id: '4', name: 'Online Portal' },
  { id: '5', name: 'Mobile App' }
];

const mockCategories = [
  { id: '1', name: 'Customer Service' },
  { id: '2', name: 'Technical Support' },
  { id: '3', name: 'Sales' },
  { id: '4', name: 'Billing' },
  { id: '5', name: 'General Inquiry' }
];

const mockServices = {
  '1': [ // Customer Service
    { id: 'cs1', name: 'Complaint Resolution' },
    { id: 'cs2', name: 'Service Request' },
    { id: 'cs3', name: 'Information Update' }
  ],
  '2': [ // Technical Support  
    { id: 'ts1', name: 'Software Issue' },
    { id: 'ts2', name: 'Hardware Problem' },
    { id: 'ts3', name: 'Network Connectivity' }
  ],
  '3': [ // Sales
    { id: 's1', name: 'Product Inquiry' },
    { id: 's2', name: 'Quote Request' },
    { id: 's3', name: 'Order Processing' }
  ],
  '4': [ // Billing
    { id: 'b1', name: 'Payment Processing' },
    { id: 'b2', name: 'Invoice Inquiry' },
    { id: 'b3', name: 'Refund Request' }
  ],
  '5': [ // General
    { id: 'g1', name: 'General Information' },
    { id: 'g2', name: 'Feedback' },
    { id: 'g3', name: 'Suggestion' }
  ]
};

const mockOffices = [
  { id: '1', name: 'Head Office - Dhaka' },
  { id: '2', name: 'Branch Office - Chittagong' },
  { id: '3', name: 'Regional Office - Sylhet' },
  { id: '4', name: 'Field Office - Khulna' }
];

interface FileUpload {
  id: string;
  name: string;
  size: number;
  progress: number;
  completed: boolean;
}

export const TaskLogger = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    source: '',
    category: '',
    service: '',
    userInfo: '',
    office: '',
    description: '',
    status: 'pending',
    comment: ''
  });

  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storageUsed, setStorageUsed] = useState(150); // MB
  const storageQuota = 500; // MB

  const availableServices = formData.category ? mockServices[formData.category as keyof typeof mockServices] || [] : [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent fields when category changes
      ...(field === 'category' ? { service: '' } : {})
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      const totalSize = storageUsed + (file.size / 1024 / 1024);
      if (totalSize > storageQuota) {
        toast({
          title: t('common.error'),
          description: `File ${file.name} exceeds storage quota`,
          variant: 'destructive'
        });
        return;
      }

      const fileUpload: FileUpload = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        progress: 0,
        completed: false
      };

      setFiles(prev => [...prev, fileUpload]);

      // Simulate file upload progress
      const interval = setInterval(() => {
        setFiles(prevFiles => 
          prevFiles.map(f => {
            if (f.id === fileUpload.id && f.progress < 100) {
              const newProgress = f.progress + 10;
              if (newProgress >= 100) {
                clearInterval(interval);
                setStorageUsed(prev => prev + (file.size / 1024 / 1024));
                return { ...f, progress: 100, completed: true };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          })
        );
      }, 200);
    });

    // Reset input
    event.target.value = '';
  };

  const removeFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file && file.completed) {
      setStorageUsed(prev => prev - (file.size / 1024 / 1024));
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t('common.success'),
        description: 'Task logged successfully!',
      });

      // Reset form
      setFormData({
        dateTime: new Date().toISOString().slice(0, 16),
        source: '',
        category: '',
        service: '',
        userInfo: '',
        office: '',
        description: '',
        status: 'pending',
        comment: ''
      });
      setFiles([]);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to log task. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('nav.taskLogger')}</h1>
        <p className="text-muted-foreground">
          Log new tasks and track your daily activities
        </p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t('tasks.newTask')}
          </CardTitle>
          <CardDescription>
            Fill out the form below to log a new task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Date & Time */}
              <div className="space-y-2">
                <Label htmlFor="dateTime" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('tasks.dateTime')}
                </Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleInputChange('dateTime', e.target.value)}
                  required
                />
              </div>

              {/* Source */}
              <div className="space-y-2">
                <Label htmlFor="source">{t('tasks.source')}</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">{t('tasks.category')}</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service (dependent on Category) */}
              <div className="space-y-2">
                <Label htmlFor="service">{t('tasks.service')}</Label>
                <Select 
                  value={formData.service} 
                  onValueChange={(value) => handleInputChange('service', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      formData.category ? "Select service..." : "Select category first"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Info */}
              <div className="space-y-2">
                <Label htmlFor="userInfo">{t('tasks.userInfo')}</Label>
                <Input
                  id="userInfo"
                  value={formData.userInfo}
                  onChange={(e) => handleInputChange('userInfo', e.target.value)}
                  placeholder="Customer ID, Phone number, etc."
                />
              </div>

              {/* Office */}
              <div className="space-y-2">
                <Label htmlFor="office">{t('tasks.office')}</Label>
                <Select value={formData.office} onValueChange={(value) => handleInputChange('office', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select office..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOffices.map((office) => (
                      <SelectItem key={office.id} value={office.id}>
                        {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('tasks.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the task..."
                rows={4}
                required
              />
            </div>

            {/* Status and Comment */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">{t('tasks.status')}</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t('tasks.pending')}</SelectItem>
                    <SelectItem value="inProgress">{t('tasks.inProgress')}</SelectItem>
                    <SelectItem value="completed">{t('tasks.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">{t('tasks.comment')}</Label>
                <Input
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  placeholder="Additional comments..."
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {t('tasks.attachments')}
                </Label>
                <div className="text-sm text-muted-foreground">
                  {storageUsed.toFixed(1)} MB / {storageQuota} MB used
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={(storageUsed / storageQuota) * 100} className="h-2" />
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-80"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={file.progress} className="h-1 flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      {file.completed && (
                        <Badge variant="secondary">
                          Uploaded
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-accent hover:opacity-90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('tasks.saveTask')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};