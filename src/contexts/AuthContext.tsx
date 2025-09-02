import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'systemadmin' | 'admin' | 'supervisor' | 'agent';
  isActive: boolean;
  avatar?: string;
  office?: string;
  team?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo purposes - replace with actual backend integration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@dnothi.com',
    fullName: 'System Administrator',
    role: 'systemadmin',
    isActive: true,
    office: 'Head Office'
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('dnothi_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with actual API call
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('dnothi_user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        email,
        fullName,
        role: 'agent', // Default role
        isActive: true
      };
      setUser(newUser);
      localStorage.setItem('dnothi_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dnothi_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};