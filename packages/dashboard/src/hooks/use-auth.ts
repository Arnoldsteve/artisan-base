"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const [refreshToken, setRefreshToken] = useState<string | null>(null); // <-- new
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const tokenFromCookie = Cookies.get('accessToken');
      const refreshTokenFromCookie = Cookies.get('refreshToken'); // <-- new
      const tenantIdFromCookie = Cookies.get('selectedOrgSubdomain');

      if (tokenFromCookie && tenantIdFromCookie) {
        apiClient.setAuthToken(tokenFromCookie);
        apiClient.setTenantId(tenantIdFromCookie);
        setToken(tokenFromCookie);
        setRefreshToken(refreshTokenFromCookie); // <-- new
        setTenantId(tenantIdFromCookie);
        try {
          const profile = await authService.getProfile();
          setUser(profile.user);
          setTenants(profile.organizations);
        } catch (error) {
          console.log(error)
        }
      }
      setIsLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const signUp = useCallback(async (data: SignUpDto) => {
    const response = await authService.signUp(data);
    const { user: signedUpUser, accessToken, refreshToken: rt } = response;

    setUser(signedUpUser);
    setToken(accessToken);
    setRefreshToken(rt); // <-- new
    apiClient.setAuthToken(accessToken);

    Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'lax' });
    Cookies.set('refreshToken', rt, { expires: 30, secure: true, sameSite: 'lax' }); // <-- new
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    const response = await authService.login(data);
    const { user: loggedInUser, accessToken, refreshToken: rt, organizations } = response;

    const selectedTenant = organizations[0]?.subdomain;
    if (!selectedTenant) {
      throw new Error("Login failed: No available organizations for this user.");
    }

    setUser(loggedInUser);
    setTenants(organizations);
    setToken(accessToken);
    setRefreshToken(rt); // <-- new
    setTenantId(selectedTenant);

    apiClient.setAuthToken(accessToken);
    apiClient.setTenantId(selectedTenant);

    Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'lax' });
    Cookies.set('refreshToken', rt, { expires: 30, secure: true, sameSite: 'lax' }); // <-- new
    Cookies.set('selectedOrgSubdomain', selectedTenant, { expires: 1, secure: true, sameSite: 'lax' });
  }, []);

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken); // <-- send refresh token to backend
      }
    } catch (error) {
      console.warn("Server logout failed, proceeding with client-side cleanup.", error);
    }

    setUser(null);
    setToken(null);
    setRefreshToken(null); // <-- clear
    setTenantId(null);
    setTenants([]);

    apiClient.setAuthToken(null);
    apiClient.setTenantId(null);

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken'); // <-- remove
    Cookies.remove('selectedOrgSubdomain');
    
    window.location.href = '/';
  }, [refreshToken]);

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
    refreshToken, // <-- expose if needed
    tenantId, 
    isLoading, 
    isAuthenticated: !isLoading && !!user,
    signUp,
    login,
    logout,
    selectTenant
  };
}
