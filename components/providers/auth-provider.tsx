"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import authConfig from '@/config/auth.config.json';

type User = {
  id: string;
  name: string;
  username: string;
  role: 'admin'; // Only admin role is allowed
  avatar: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('secureview-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Find the user in the config file
        const foundUser = authConfig.users.find(
          (u) => u.username === username && u.password === password && u.role === 'admin'
        );

        if (foundUser) {
          // Using type assertion after destructuring to fix linting issues
          const { password: _, ...userWithoutPassword } = foundUser;
          const safeUser = userWithoutPassword as User;
          
          setUser(safeUser);
          setIsAuthenticated(true);
          localStorage.setItem('secureview-user', JSON.stringify(safeUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials or insufficient permissions'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('secureview-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};