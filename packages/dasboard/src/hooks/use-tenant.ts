// File: packages/dasboard/src/hooks/use-tenant.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant-service";
import { toast } from "sonner";
import { CreateTenantDto, CreateTenantResponse, AvailabilityResponse } from "@/types/tenant";
import { useAuthContext } from "@/contexts/auth-context";
import { useDebounce } from "./use-debounce";

const AVAILABILITY_QUERY_KEY = ["tenant-subdomain-availability"];

/**
 * Hook for checking the availability of a subdomain.
 * Provides detailed status for immediate UI feedback.
 * @param subdomain The subdomain string to check.
 */
export function useSubdomainAvailability(subdomain: string) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();
  const debouncedSubdomain = useDebounce(subdomain, 500);

  // Determine the validity of the subdomain string itself.
  const isSubdomainValidLength = debouncedSubdomain.length > 2;
  const isSubdomainValidFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(debouncedSubdomain);

  const query = useQuery<AvailabilityResponse>({
    queryKey: [...AVAILABILITY_QUERY_KEY, debouncedSubdomain],
    queryFn: () => tenantService.checkSubdomainAvailability(debouncedSubdomain),
    
    // The API call is only enabled if the user is logged in AND the subdomain format is valid.
    enabled: !isAuthLoading && isAuthenticated && isSubdomainValidLength && isSubdomainValidFormat,
  });

  // Return a more comprehensive state for the UI to consume.
  return {
    ...query,
    isValidLength: isSubdomainValidLength,
    isValidFormat: isSubdomainValidFormat,
    // Provide a clear overall "isLoading" status for the UI.
    isLoading: query.isLoading && isSubdomainValidLength && isSubdomainValidFormat,
  };
}

/**
 * Hook for creating a new tenant (organization/store).
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { selectTenant } = useAuthContext();

  return useMutation({
    mutationFn: (data: CreateTenantDto) => tenantService.createTenant(data),
    onSuccess: (response: CreateTenantResponse) => {
      toast.success(response.message || `Store "${response.tenant.name}" created successfully.`);
      
      // Make the newly created tenant the active one.
      selectTenant(response.tenant.subdomain);

      // Invalidate queries that might depend on the user's list of tenants.
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create store.");
    },
  });
}