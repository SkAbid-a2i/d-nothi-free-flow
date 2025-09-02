import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Users, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  UserPlus,
  Database,
  List,
  FileText
} from 'lucide-react';

export const AdminConsole = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    role: 'agent',
    office: '',
    team: ''
  });

  // Mock data for demo
  const users = [
    {
      id: '1',
      email: 'admin@dnothi.com',
      fullName: 'System Administrator',
      role: 'systemadmin',
      isActive: true,
      office: 'Head Office',
      team: ''
    },
    {
      id: '2',
      email: 'supervisor@dnothi.com', 
      fullName: 'Team Supervisor',
      role: 'supervisor',
      isActive: true,
      office: 'Branch Office',
      team: 'Team A'
    },
    {
      id: '3',
      email: 'agent@dnothi.com',
      fullName: 'Field Agent',
      role: 'agent',
      isActive: true,
      office: 'Field Office',
      team: 'Team A'
    }
  ];

  const [dropdowns, setDropdowns] = useState<{
    sources: string[];
    categories: string[];
    services: Record<string, string[]>;
    offices: string[];
  }>({
    sources: ['Website', 'Phone', 'Email', 'Walk-in', 'Mobile App'],
    categories: ['Support', 'Sales', 'Billing', 'Technical', 'General'],
    services: {
      'Support': ['Technical Issue', 'Account Issue', 'Password Reset'],
      'Sales': ['Product Inquiry', 'Demo Request', 'Quote Request'],
      'Billing': ['Payment Issue', 'Invoice Query', 'Refund Request'],
      'Technical': ['Bug Report', 'Feature Request', 'Integration Help'],
      'General': ['Information Request', 'Complaint', 'Feedback']
    },
    offices: ['Head Office', 'Branch Office', 'Field Office', 'Remote Office']
  });

  const [newDropdownItem, setNewDropdownItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!user || (user.role !== 'systemadmin' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the Admin Console. This feature is only available for System Administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateUser = () => {
    console.log('Creating user:', newUser);
    // Mock user creation - in real app, this would call backend API
    setNewUser({ email: '', fullName: '', role: 'agent', office: '', team: '' });
  };

  const addDropdownItem = (type: string, category?: string) => {
    if (!newDropdownItem.trim()) return;
    
    setDropdowns(prev => {
      const updated = { ...prev };
      if (type === 'services' && category) {
        updated.services = {
          ...updated.services,
          [category]: [...(updated.services[category] || []), newDropdownItem]
        };
      } else if (type !== 'services') {
        const currentArray = updated[type as keyof Omit<typeof dropdowns, 'services'>] as string[];
        updated[type as keyof Omit<typeof dropdowns, 'services'>] = [...currentArray, newDropdownItem];
      }
      return updated;
    });
    setNewDropdownItem('');
  };

  const removeDropdownItem = (type: string, item: string, category?: string) => {
    setDropdowns(prev => {
      const updated = { ...prev };
      if (type === 'services' && category) {
        updated.services = {
          ...updated.services,
          [category]: updated.services[category]?.filter(s => s !== item) || []
        };
      } else if (type !== 'services') {
        const currentArray = updated[type as keyof Omit<typeof dropdowns, 'services'>] as string[];
        updated[type as keyof Omit<typeof dropdowns, 'services'>] = currentArray.filter(i => i !== item);
      }
      return updated;
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'systemadmin': return 'bg-destructive text-destructive-foreground';
      case 'admin': return 'bg-primary text-primary-foreground';
      case 'supervisor': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Console</h1>
          <p className="text-muted-foreground">Manage users, roles, and system settings</p>
        </div>
        <Badge className="bg-gradient-primary text-white px-3 py-1">
          <Shield className="w-4 h-4 mr-1" />
          Administrator Access
        </Badge>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="dropdowns" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Dropdown Settings
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Create User */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create New User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@company.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser(prev => ({...prev, fullName: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({...prev, role: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {user?.role === 'systemadmin' && (
                        <SelectItem value="systemadmin">System Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="office">Office</Label>
                  <Select value={newUser.office} onValueChange={(value) => setNewUser(prev => ({...prev, office: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select office" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdowns.offices.map(office => (
                        <SelectItem key={office} value={office}>{office}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team (Optional)</Label>
                  <Input
                    id="team"
                    placeholder="Team A"
                    value={newUser.team}
                    onChange={(e) => setNewUser(prev => ({...prev, team: e.target.value}))}
                  />
                </div>
              </div>
              <Button onClick={handleCreateUser} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Office/Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('admin', 'Admin').replace('supervisor', 'Supervisor').replace('agent', 'Agent')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.office}</div>
                          {user.team && <div className="text-muted-foreground">{user.team}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={user.isActive} />
                          <span className="text-sm">{user.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dropdowns Tab */}
        <TabsContent value="dropdowns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Task Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new source..."
                    value={newDropdownItem}
                    onChange={(e) => setNewDropdownItem(e.target.value)}
                  />
                  <Button onClick={() => addDropdownItem('sources')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {dropdowns.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{source}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeDropdownItem('sources', source)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Task Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new category..."
                    value={newDropdownItem}
                    onChange={(e) => setNewDropdownItem(e.target.value)}
                  />
                  <Button onClick={() => addDropdownItem('categories')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {dropdowns.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{category}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeDropdownItem('categories', category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Services (by Category)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category to manage services" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdowns.categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedCategory && (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Add service for ${selectedCategory}...`}
                        value={newDropdownItem}
                        onChange={(e) => setNewDropdownItem(e.target.value)}
                      />
                      <Button onClick={() => addDropdownItem('services', selectedCategory)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(dropdowns.services[selectedCategory] || []).map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{service}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeDropdownItem('services', service, selectedCategory)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Offices */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Office Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new office..."
                    value={newDropdownItem}
                    onChange={(e) => setNewDropdownItem(e.target.value)}
                  />
                  <Button onClick={() => addDropdownItem('offices')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {dropdowns.offices.map((office, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{office}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeDropdownItem('offices', office)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">File Upload Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size Per User (MB)</Label>
                    <Input id="maxFileSize" type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedTypes">Allowed File Types</Label>
                    <Textarea 
                      id="allowedTypes" 
                      defaultValue="PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Security Settings</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                    <Switch id="twoFactor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sessionTimeout">Auto Logout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="60" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auditLog">Enable Audit Logging</Label>
                    <Switch id="auditLog" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full sm:w-auto">
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Backup & Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Audit Logs
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  User Activity Report
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  System Health Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};