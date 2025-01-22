import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize state from localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState<any>(() => {
    // Initialize user from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  axios.defaults.withCredentials = true;

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:4000/routes/login', { email, password });
      const userData = response.data;

      // Persist state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear state and localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');

    setIsAuthenticated(false);
    setUser(null);

    window.location.href = '/login'; // Redirect to login page
  };

  const register = async (userData: any) => {
    try {
      await axios.post('http://localhost:4000/routes/register', userData);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
