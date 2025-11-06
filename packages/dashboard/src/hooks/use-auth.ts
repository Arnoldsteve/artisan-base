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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const tokenFromCookie = Cookies.get("accessToken");
      const refreshTokenFromCookie = Cookies.get("refreshToken");
      const tenantIdFromCookie = Cookies.get("selectedOrgSubdomain");

      if (tokenFromCookie && tenantIdFromCookie) {
        apiClient.setAuthToken(tokenFromCookie);
        apiClient.setTenantId(tenantIdFromCookie);
        setToken(tokenFromCookie);
        setRefreshToken(refreshTokenFromCookie ?? null);
        setTenantId(tenantIdFromCookie);
        try {
          const profile = await authService.getProfile();
          setUser(profile.user);
          setTenants(profile.organizations);
        } catch (error) {
          console.log("Error loading profile:", error);
          // Try to refresh token if profile fetch fails
          const newToken = await refreshAccessToken();
          if (newToken) {
            // Retry getting profile
            try {
              apiClient.setAuthToken(newToken);
              const profile = await authService.getProfile();
              setUser(profile.user);
              setTenants(profile.organizations);
              setToken(newToken);
            } catch (retryError) {
              console.error(
                "Failed to load profile after token refresh:",
                retryError
              );
            }
          }
        }
      }
      setIsLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const signUp = useCallback(async (data: SignUpDto) => {
    const response = await authService.signUp(data);
    const { user: signedUpUser, accessToken, refreshToken } = response;

    setUser(signedUpUser);
    setToken(accessToken);
    setRefreshToken(refreshToken);
    apiClient.setAuthToken(accessToken);

    Cookies.set("accessToken", accessToken, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: 30,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }, []);

  const login = useCallback(async (data: LoginDto) => {
  const response = await authService.login(data);
  const { user: loggedInUser, accessToken, refreshToken, organizations } = response;

  console.log("logged user organisation", organizations)

  // Save tokens first so user is authenticated during onboarding too
  Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "lax" });
  Cookies.set("refreshToken", refreshToken, { expires: 30, sameSite: "lax" });

  setUser(loggedInUser);
  setToken(accessToken);
  setRefreshToken(refreshToken);
  apiClient.setAuthToken(accessToken);

  // ✅ Case 1: User has no tenant yet → go to setup flow
  if (!organizations || organizations.length === 0) {
    router.push("/onboarding/create-store");
    return;
  }

  // ✅ Case 2: User has at least one tenant → continue
  const selectedTenant = organizations[0].subdomain;

  setTenants(organizations);
  setTenantId(selectedTenant);
  apiClient.setTenantId(selectedTenant);

  Cookies.set("selectedOrgSubdomain", selectedTenant, {
    expires: 1,
    sameSite: "lax",
  });

  // Finally → go to dashboard
  router.push("/home");
}, []);

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.warn(
        "Server logout failed, proceeding with client-side cleanup.",
        error
      );
    }

    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setTenantId(null);
    setTenants([]);

    apiClient.setAuthToken(null);
    apiClient.setTenantId(null);

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("selectedOrgSubdomain");

    window.location.href = "/";
  }, [refreshToken]);

  const selectTenant = useCallback(
    (newTenantId: string) => {
      setTenantId(newTenantId);
      apiClient.setTenantId(newTenantId);
      Cookies.set("selectedOrgSubdomain", newTenantId, {
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
    refreshToken,
    tenantId,
    isLoading,
    isAuthenticated: !isLoading && !!user,
    signUp,
    login,
    logout,
    selectTenant,
  };
}
