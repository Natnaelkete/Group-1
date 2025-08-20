import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  loading: boolean;
  setAuth: (token: string, userId: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    const storedUserId = localStorage.getItem('user-id');
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  const setAuth = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem('auth-token', newToken);
    localStorage.setItem('user-id', newUserId);
  };

  const signOut = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-id');
  };

  const value = {
    token,
    userId,
    loading, 
    setAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
