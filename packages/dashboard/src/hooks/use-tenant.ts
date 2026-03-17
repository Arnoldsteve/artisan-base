"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tenantService } from "@/services/tenant-service";
import { useAuthContext } from "@/contexts/auth-context";
import { UpdateTenantDto, CreateStoreDto } from "@/types/tenant";

export const useTenant = () => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  const TENANT_QUERY_KEY = ["tenant", tenantId];

  // 1. Fetch current active store profile
  const tenantQuery = useQuery({
    queryKey: TENANT_QUERY_KEY,
    queryFn: () => tenantService.getProfile(),
    enabled: isAuthenticated && !!tenantId && !isAuthLoading,
  });

  // 2. Update store profile
  const updateTenantMutation = useMutation({
    mutationFn: (data: UpdateTenantDto) => tenantService.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(TENANT_QUERY_KEY, updated);
      toast.success("Store settings updated successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update store"),
  });

  // 3. Provision new store (Scenario 2)
  const createStoreMutation = useMutation({
    mutationFn: (data: CreateStoreDto) => tenantService.provisionStore(data),
    onSuccess: (newStore) => {
      toast.success(`Store "${newStore.name}" created successfully!`);
      // Optional: Refresh global tenants list or switch to new store
    },
    onError: (err: any) => toast.error(err.message || "Failed to create store"),
  });

  // 4. Delete store (Danger Zone)
  const deleteTenantMutation = useMutation({
    mutationFn: () => tenantService.delete(),
    onSuccess: () => {
      toast.success("Store deleted permanently.");
      window.location.href = "/"; // Redirect to global landing
    },
    onError: (err: any) => toast.error(err.message || "Deletion failed"),
  });

  return {
    tenant: tenantQuery.data,
    isLoading: tenantQuery.isLoading,
    isError: tenantQuery.isError,
    
    updateTenant: updateTenantMutation.mutate,
    isUpdating: updateTenantMutation.isPending,
    
    createStore: createStoreMutation.mutate,
    isCreatingStore: createStoreMutation.isPending,
    
    deleteTenant: deleteTenantMutation.mutate,
    isDeleting: deleteTenantMutation.isPending,
  };
};


// ⚡ ADD THIS: Standalone hook for the Setup Form
export const useCreateTenant = () => {
  return useMutation({
    mutationFn: (data: CreateStoreDto) => tenantService.provisionStore(data),
    onSuccess: (newStore) => {
      toast.success(`Store "${newStore.name}" created successfully!`);
      window.location.href = "/"; // Force refresh to load new tenant context
    },
    onError: (err: any) => toast.error(err.message || "Failed to create store"),
  });
};

// ⚡ ADD THIS: Subdomain validation hook for the Setup Form
export const useSubdomainAvailability = (subdomain: string) => {
  const query = useQuery({
    queryKey: ["subdomain-check", subdomain],
    queryFn: () => tenantService.checkAvailability(subdomain),
    enabled: subdomain.length >= 3,
  });

  return {
    ...query,
    isValidFormat: /^[a-z0-9-]+$/.test(subdomain),
    isValidLength: subdomain.length >= 3,
  };
};