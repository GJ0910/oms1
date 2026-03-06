'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, VALID_CREDENTIALS, ROLE_MAP } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load user from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    setIsHydrated(true);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (VALID_CREDENTIALS[email] === password) {
      const role = ROLE_MAP[email];
      const newUser = { email, role, name: email.split('@')[0] };
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
