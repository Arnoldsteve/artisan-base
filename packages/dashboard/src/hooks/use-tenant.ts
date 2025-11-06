"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant-service";
import { toast } from "sonner";
import {
  CreateTenantDto,
  CreateTenantResponse,
  AvailabilityResponse,
} from "@/types/tenant";
import { useAuthContext } from "@/contexts/auth-context";
import { useDebounce } from "./use-debounce";
import { useRouter } from "next/navigation";

const AVAILABILITY_QUERY_KEY = ["tenant-subdomain-availability"];

/**
 * Hook for checking the availability of a subdomain.
 * Provides detailed status for immediate UI feedback.
 * @param subdomain The subdomain string to check.
 */
export function useSubdomainAvailability(subdomain: string) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  const debouncedSubdomain = useDebounce(subdomain, 500);

  const isSubdomainValidLength = debouncedSubdomain.length > 2;

  const isSubdomainValidFormat = /^[a-z0-9-]+$/.test(debouncedSubdomain);

  const query = useQuery<AvailabilityResponse>({
    queryKey: [...AVAILABILITY_QUERY_KEY, debouncedSubdomain],
    queryFn: () => tenantService.checkSubdomainAvailability(debouncedSubdomain),

    enabled:
      !isAuthLoading &&
      isAuthenticated &&
      isSubdomainValidLength &&
      isSubdomainValidFormat,
  });

  return {
    ...query,
    isValidLength: isSubdomainValidLength,
    isValidFormat: isSubdomainValidFormat,
    isLoading:
      query.isLoading && isSubdomainValidLength && isSubdomainValidFormat,
  };
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { selectTenant } = useAuthContext();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateTenantDto) => tenantService.createTenant(data),
    retry: false,
    onSuccess: (response: CreateTenantResponse) => {
      toast.success(
        response.message ||
          `Store "${response.tenant.name}" created successfully.`
      );

      selectTenant(response.tenant.subdomain);

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      router.push("/home");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create store.");
    },
  });
}
