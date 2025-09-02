import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ClipboardList,
  ListTodo,
  Users,
  Calendar,
  Folder,
  Settings,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getNavigationItems = (userRole: string, t: (key: string) => string) => {
  const baseItems = [
    {
      title: t('nav.dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard,
      roles: ['systemadmin', 'admin', 'supervisor', 'agent']
    },
    {
      title: t('nav.taskLogger'),
      url: '/task-logger',
      icon: ClipboardList,
      roles: ['systemadmin', 'admin', 'supervisor', 'agent']
    },
    {
      title: t('nav.myTasks'),
      url: '/my-tasks',
      icon: ListTodo,
      roles: ['systemadmin', 'admin', 'supervisor', 'agent']
    },
    {
      title: t('nav.teamTasks'),
      url: '/team-tasks',
      icon: Users,
      roles: ['systemadmin', 'admin', 'supervisor']
    },
    {
      title: t('nav.leaves'),
      url: '/leaves',
      icon: Calendar,
      roles: ['systemadmin', 'admin', 'supervisor', 'agent']
    },
    {
      title: t('nav.files'),
      url: '/files',
      icon: Folder,
      roles: ['systemadmin', 'admin', 'supervisor', 'agent']
    },
    {
      title: t('nav.adminConsole'),
      url: '/admin',
      icon: Settings,
      roles: ['systemadmin', 'admin', 'supervisor']
    },
    {
      title: t('nav.help'),
      url: '/help',
      icon: HelpCircle,
      roles: ['systemadmin', 'admin', 'supervisor', 'agent']
    }
  ];

  return baseItems.filter(item => item.roles.includes(userRole));
};

export const AppSidebar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const navigationItems = getNavigationItems(user?.role || 'agent', t);
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";
  };

  return (
    <Sidebar className="bg-gradient-primary border-r border-sidebar-border shadow-medium">
      <SidebarHeader className="p-4 border-b border-sidebar-border/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-white">D</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">D-Nothi</h1>
              <p className="text-xs text-sidebar-foreground/70">Task & Leave Tracker</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/20">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-sidebar-accent">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role}
              </p>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/20"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">{t('nav.logout')}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};