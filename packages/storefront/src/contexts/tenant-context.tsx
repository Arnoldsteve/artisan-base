"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { tenantService, TenantProfile } from "@/services/tenant-service";
import { apiClient } from "@/lib/api-client";

interface TenantContextType {
  tenant: TenantProfile | null;
  isLoading: boolean;
  isError: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

/**
 * SOLID Principle: Single Responsibility
 * This provider is responsible for translating the URL slug into a 
 * functional store context for the entire storefront.
 */
export function TenantProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params?.slug as string;

  // 1. Resolve the store based on the URL slug
  // Millions of Users: We use staleTime to cache this resolution in memory
  const { data: tenant, isLoading, isError } = useQuery({
    queryKey: ["tenant-resolve", slug],
    queryFn: () => tenantService.resolveStore(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 30, // 30 minutes (Store info changes rarely)
  });

  // 2. Sync the API Client
  // Every time the tenant changes, we update the outgoing headers
  useEffect(() => {
    if (tenant?.id) {
      // We will add this method to your apiClient in the next step
      (apiClient as any).setTenantId(tenant.id);
    }
  }, [tenant?.id]);

  const value = useMemo(() => ({
    tenant: tenant || null,
    isLoading,
    isError,
  }), [tenant, isLoading, isError]);

  // Loading State: Essential for the "Jumia" feel to prevent content layout shift
  if (isLoading && !!slug) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse text-sm text-muted-foreground">
          Entering Store...
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenantContext must be used within a TenantProvider");
  }
  return context;
};