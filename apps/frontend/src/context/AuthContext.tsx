import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // CRITICAL FIX: Initialize state by reading from localStorage
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth-token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('user-id'));
  
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
