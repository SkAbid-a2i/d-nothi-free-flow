import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  FileText,
  Image,
  File,
  Folder,
  Cloud,
  HardDrive,
  Eye
} from 'lucide-react';

export const Files = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dragActive, setDragActive] = useState(false);

  // Mock file data
  const files = [
    {
      id: '1',
      name: 'Task_Report_Jan_2024.pdf',
      type: 'pdf',
      size: 2.1,
      uploadDate: '2024-01-15T10:30:00',
      taskId: 'TSK001',
      category: 'Report'
    },
    {
      id: '2',
      name: 'Customer_Screenshot.png',
      type: 'image',
      size: 0.8,
      uploadDate: '2024-01-14T14:20:00',
      taskId: 'TSK002',
      category: 'Support'
    },
    {
      id: '3',
      name: 'Meeting_Notes.docx',
      type: 'document',
      size: 0.3,
      uploadDate: '2024-01-13T09:15:00',
      taskId: 'TSK003',
      category: 'Meeting'
    },
    {
      id: '4',
      name: 'Product_Demo.mp4',
      type: 'video',
      size: 15.7,
      uploadDate: '2024-01-12T16:45:00',
      taskId: 'TSK004',
      category: 'Sales'
    }
  ];

  const totalUsedSpace = files.reduce((total, file) => total + file.size, 0);
  const totalQuota = 500; // 500 MB
  const usagePercentage = (totalUsedSpace / totalQuota) * 100;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'image': return <Image className="w-5 h-5 text-blue-500" />;
      case 'document': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'video': return <File className="w-5 h-5 text-purple-500" />;
      default: return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${Math.round(sizeInMB * 1024)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const getQuotaColor = () => {
    if (usagePercentage > 90) return 'text-destructive';
    if (usagePercentage > 75) return 'text-warning';
    return 'text-success';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileUpload = (files: FileList) => {
    // Mock file upload logic
    console.log('Uploading files:', files);
    // In real app, this would upload to backend/cloud storage
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">File Management</h1>
          <p className="text-muted-foreground">Manage your uploaded files and attachments</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>

      {/* Storage Quota */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Used Storage</span>
              </div>
              <span className={`text-sm font-medium ${getQuotaColor()}`}>
                {formatFileSize(totalUsedSpace)} / {formatFileSize(totalQuota)}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{files.length}</div>
                <div className="text-xs text-muted-foreground">Total Files</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">{formatFileSize(totalQuota - totalUsedSpace)}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-accent">{usagePercentage.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Used</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files here, or click to select files
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button>
                  Choose Files
                </Button>
                <span className="text-sm text-muted-foreground">
                  Max file size: 50MB per file
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, MP4, MOV
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search files by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Your Files ({filteredFiles.length})
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Bulk Download
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">Task: {file.taskId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{file.type}</Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{file.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(file.uploadDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">{new Date(file.uploadDate).toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Files Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== 'all' 
                  ? 'No files match your current filters. Try adjusting your search criteria.'
                  : 'You haven\'t uploaded any files yet. Upload your first file to get started.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};