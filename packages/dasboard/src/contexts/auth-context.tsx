// File: packages/dasboard/src/contexts/auth-context.tsx
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/use-auth';
import { LoginDto, SignUpDto } from '@/types/auth';
import { User } from '@/types/users';
import { Tenant } from '@/types/tenant'; // <-- IMPORT YOUR SPECIFIC TENANT TYPE

// Define the shape of the value that our context will provide
interface AuthContextType {
  user: User | null;
  tenants: Tenant[]; // <-- USE THE CORRECT TYPE
  token: string | null;
  tenantId: string | null; // This is the subdomain string
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: SignUpDto) => Promise<void>; 
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  selectTenant: (tenantId: string) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Create a custom hook for consuming the context's value
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}