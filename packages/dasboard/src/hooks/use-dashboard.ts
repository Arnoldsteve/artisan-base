// File: packages/dasboard/src/hooks/use-dashboard.ts
"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard-service";
import { DashboardKPI, RecentOrdersResponse } from "@/types/dashboard";
import { useAuthContext } from "@/contexts/auth-context";

// Define unique query keys for each piece of data
const KPIS_QUERY_KEY = ["dashboard-kpis"];
const RECENT_ORDERS_QUERY_KEY = ["dashboard-recent-orders"];

/**
 * Hook for fetching ONLY the KPI data for the dashboard stats cards.
 */
export function useDashboardKpis() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<DashboardKPI>({
    queryKey: KPIS_QUERY_KEY,
    queryFn: () => dashboardService.getKpis(),
    enabled: !isAuthLoading && isAuthenticated,
    staleTime: 1000 * 60 * 5, // Cache KPIs for 5 minutes
  });
}

/**
 * Hook for fetching ONLY the recent orders for the dashboard table.
 */
export function useRecentOrders() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<RecentOrdersResponse>({
    queryKey: RECENT_ORDERS_QUERY_KEY,
    queryFn: () => dashboardService.getRecentOrders(),
    enabled: !isAuthLoading && isAuthenticated,
    staleTime: 1000 * 60, // Cache recent orders for 1 minute
  });
}

/**
 * Optional: A convenience hook that combines both queries.
 * This can be useful if a page truly needs to wait for both.
 * It uses `useQueries` to run both fetches in parallel.
 */
export function useDashboardData() {
    const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

    const results = useQueries({
        queries: [
            {
                queryKey: KPIS_QUERY_KEY,
                queryFn: () => dashboardService.getKpis(),
                enabled: !isAuthLoading && isAuthenticated,
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: RECENT_ORDERS_QUERY_KEY,
                queryFn: () => dashboardService.getRecentOrders(),
                enabled: !isAuthLoading && isAuthenticated,
                staleTime: 1000 * 60,
            }
        ]
    });

    // Consolidate the results into a single, convenient object
    const isLoading = results.some(query => query.isLoading);
    const isError = results.some(query => query.isError);

    return {
        isLoading,
        isError,
        kpis: results[0].data as DashboardKPI | undefined,
        recentOrdersData: results[1].data as RecentOrdersResponse | undefined,
    }
}