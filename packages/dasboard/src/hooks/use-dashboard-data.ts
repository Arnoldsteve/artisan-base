// File: packages/dasboard/src/hooks/use-dashboard.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard-service";
import { DashboardData } from "@/types/dashboard";
import { useAuthContext } from "@/contexts/auth-context";

// Define a query key to uniquely identify the dashboard's data
const DASHBOARD_QUERY_KEY = ["dashboard-data"];

/**
 * Hook for fetching the aggregated data for the main dashboard.
 * Handles caching, refetching, loading, and error states automatically.
 * It is "auth-aware" and will not run until the user is authenticated.
 */
export function useDashboardData() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<DashboardData>({
    // The query key is a simple array since this data isn't paginated
    queryKey: DASHBOARD_QUERY_KEY,
    
    // The queryFn is the async function that fetches the data from our service
    queryFn: () => dashboardService.getDashboardData(),
    
    // This query will ONLY run if auth is not loading AND the user is authenticated
    enabled: !isAuthLoading && isAuthenticated,

    // Optional: Set a staleTime to prevent refetching too frequently on this page
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}