"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { apiClient } from "@/lib/client-api";
import Cookies from "js-cookie";
import { User } from "@/types/users";
import { LoginDto, SignUpDto } from "@/types/auth";
import { Tenant } from "@/types/tenant";
import { refreshAccessToken } from "@/lib/refresh-token";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null); // real DB id
  const [subdomain, setSubdomain] = useState<string | null>(null); // for x-tenant-id header
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const tokenFromCookie = Cookies.get("accessToken");
      const subdomainFromCookie = Cookies.get("selectedOrgSubdomain");
      const tenantIdFromCookie = Cookies.get("selectedTenantId");

      if (tokenFromCookie && subdomainFromCookie) {
        apiClient.setAuthToken(tokenFromCookie);
        apiClient.setTenantId(subdomainFromCookie);
        setToken(tokenFromCookie);
        setSubdomain(subdomainFromCookie);
        setTenantId(tenantIdFromCookie ?? null);

        try {
          const profile = await authService.getProfile();
          setUser(profile.user);
          setTenants(profile.organizations);
        } catch (error) {
          console.log("Error loading profile:", error);
          const newToken = await refreshAccessToken();
          if (newToken) {
            try {
              apiClient.setAuthToken(newToken);
              const profile = await authService.getProfile();
              setUser(profile.user);
              setTenants(profile.organizations);
              setToken(newToken);
            } catch (retryError) {
              console.error("Failed to load profile after token refresh:", retryError);
            }
          }
        }
      }
      setIsLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    const response = await authService.login(data);
    const { user: loggedInUser, backend_tokens, tenants: organizations } = response;
    const { accessToken, refreshToken } = backend_tokens;

    Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "lax" });
    Cookies.set("refreshToken", refreshToken, { expires: 30, sameSite: "lax" });

    setUser(loggedInUser);
    setToken(accessToken);
    apiClient.setAuthToken(accessToken);

    // ✅ Case 1: No tenant yet → onboarding to create store
    if (!organizations || organizations.length === 0) {
      router.push("/onboarding/create-store");
      return;
    }

    // ✅ Case 2: Has tenant → store both subdomain and real id
    const selectedTenant = organizations[0];

    setTenants(organizations);
    setTenantId(selectedTenant.id);
    setSubdomain(selectedTenant.subdomain);
    apiClient.setTenantId(selectedTenant.subdomain);

    Cookies.set("selectedOrgSubdomain", selectedTenant.subdomain, {
      expires: 1,
      sameSite: "lax",
    });
    Cookies.set("selectedTenantId", selectedTenant.id, {
      expires: 1,
      sameSite: "lax",
    });

    router.push("/home");
  }, [router]);

  /**
   * Register → then auto-login to get JWT.
   * Backend /onboarding/register returns no token, so we login immediately after.
   */
  const signUp = useCallback(async (data: SignUpDto) => {
    await authService.signUp(data);
    await login({ email: data.email, password: data.password });
  }, [login]);

  const logout = useCallback(async () => {
    const refreshToken = Cookies.get("refreshToken");
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.warn("Server logout failed, proceeding with client-side cleanup.", error);
    }

    setUser(null);
    setToken(null);
    setTenantId(null);
    setSubdomain(null);
    setTenants([]);

    apiClient.setAuthToken(null);
    apiClient.setTenantId(null);

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("selectedOrgSubdomain");
    Cookies.remove("selectedTenantId");

    window.location.href = "/";
  }, []);

  const selectTenant = useCallback(
    (tenant: Tenant) => {
      setTenantId(tenant.id);
      setSubdomain(tenant.subdomain);
      apiClient.setTenantId(tenant.subdomain);
      Cookies.set("selectedOrgSubdomain", tenant.subdomain, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      Cookies.set("selectedTenantId", tenant.id, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      router.refresh();
    },
    [router]
  );

  return {
    user,
    tenants,
    token,
    tenantId,   // real DB id — used for bootstrap
    subdomain,  // subdomain — used for x-tenant-id header
    isLoading,
    isAuthenticated: !isLoading && !!user,
    signUp,
    login,
    logout,
    selectTenant,
  };
}