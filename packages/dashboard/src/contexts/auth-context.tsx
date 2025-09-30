"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/use-auth';
import { LoginDto, SignUpDto } from '@/types/auth';
import { User } from '@/types/users';
import { Tenant } from '@/types/tenant'; 

interface AuthContextType {
  user: User | null;
  tenants: Tenant[]; 
  token: string | null;
  tenantId: string | null; 
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: SignUpDto) => Promise<void>; 
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  selectTenant: (tenantId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}