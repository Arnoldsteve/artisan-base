"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/client-api";
import { useAuthContext } from "./auth-context";

interface BootstrapResponse {
  user: any;
  tenant: any;
  productsCount: number;
  categoriesCount: number;
}

interface TenantContextType {
  user: any;
  tenant: any;
  productsCount: number;
  categoriesCount: number;
  refetch: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, tenantId } = useAuthContext();

  // ⚡ THE MASTER HANDSHAKE
  const { data, isLoading, refetch } = useQuery<BootstrapResponse>({
    queryKey: ["bootstrap", tenantId],
    queryFn: async () => {
      return apiClient.get<BootstrapResponse>(`/auth/bootstrap?tenantId=${tenantId}`);
    },
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading && isAuthenticated && tenantId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">
          Bootstrapping Workspace...
        </p>
      </div>
    );
  }

  return (
    <TenantContext.Provider
      value={{
        user: data?.user,
        tenant: data?.tenant,
        productsCount: data?.productsCount ?? 0,
        categoriesCount: data?.categoriesCount ?? 0,
        refetch,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenantContext must be used within TenantProvider");
  return context;
};