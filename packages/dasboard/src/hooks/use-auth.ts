// File: packages/dasboard/src/hooks/use-auth.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// --- THIS IS THE FIX ---
// Import the INSTANCE (authService), not the CLASS (AuthService)
import { authService } from '@/services/auth-service';
import { apiClient } from '@/lib/client-api';
import Cookies from 'js-cookie';
import { User } from '@/types/users';
import { LoginDto, SignUpDto } from '@/types/auth';
import { Tenant } from '@/types/tenant';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const tokenFromCookie = Cookies.get('accessToken');
      const tenantIdFromCookie = Cookies.get('selectedOrgSubdomain');

      if (tokenFromCookie && tenantIdFromCookie) {
        apiClient.setAuthToken(tokenFromCookie);
        apiClient.setTenantId(tenantIdFromCookie);
        setToken(tokenFromCookie);
        setTenantId(tenantIdFromCookie);
        try {
          // --- FIX APPLIED HERE ---
          // Use the lowercase instance `authService`
          const profile = await authService.getProfile();
          setUser(profile.user);
          setTenants(profile.organizations);
        } catch (error) {
          // ... error handling
        }
      }
      setIsLoading(false);
    }
    loadUserFromCookies();
  }, []);

   const signUp = useCallback(async (data: SignUpDto) => {
    const response = await authService.signUp(data);
    const { user: signedUpUser, accessToken } = response;
    
    // After signing up, the user is effectively logged in, but may not have a tenant yet.
    // For now, we set the user and token.
    setUser(signedUpUser);
    setToken(accessToken);
    apiClient.setAuthToken(accessToken);

    Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'lax' });

    // The user will likely be redirected to a "create your first store" page.
    // The login logic handles tenant selection.
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    // --- FIX APPLIED HERE ---
    // Use the lowercase instance `authService`
    const response = await authService.login(data);
    const { user: loggedInUser, accessToken, organizations } = response;
    
    const selectedTenant = organizations[0]?.subdomain;

    if (!selectedTenant) {
      throw new Error("Login failed: No available organizations for this user.");
    }

    setUser(loggedInUser);
    setTenants(organizations);
    setToken(accessToken);
    setTenantId(selectedTenant);

    apiClient.setAuthToken(accessToken);
    apiClient.setTenantId(selectedTenant);

    Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'lax' });
    Cookies.set('selectedOrgSubdomain', selectedTenant, { expires: 1, secure: true, sameSite: 'lax' });
  }, []);

  const logout = useCallback(() => {
    // Optional: Call logout on the service if it exists
    // authService.logout(); 

    setUser(null);
    setToken(null);
    setTenantId(null);
    setTenants([]);

    apiClient.setAuthToken(null);
    apiClient.setTenantId(null);

    Cookies.remove('accessToken');
    Cookies.remove('selectedOrgSubdomain');
    
    window.location.href = '/login'; 
  }, []);
  
  const selectTenant = useCallback((newTenantId: string) => {
    setTenantId(newTenantId);
    apiClient.setTenantId(newTenantId);
    Cookies.set('selectedOrgSubdomain', newTenantId, { expires: 1, secure: true, sameSite: 'lax' });
    router.refresh();
  }, [router]);

  return { 
    user, 
    tenants,
    token, 
    tenantId, 
    isLoading, 
    isAuthenticated: !isLoading && !!user,
    signUp,
    login,
    logout,
    selectTenant
  };
}