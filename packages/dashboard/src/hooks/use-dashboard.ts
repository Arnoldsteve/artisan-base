"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard-service";
// Import the new SalesOverviewResponse type
import { DashboardKPI, RecentOrdersResponse, SalesOverviewResponse } from "@/types/dashboard";
import { useAuthContext } from "@/contexts/auth-context";

// Define unique query keys for each piece of data
const KPIS_QUERY_KEY = ["dashboard-kpis"];
const RECENT_ORDERS_QUERY_KEY = ["dashboard-recent-orders"];
// --- NEW ---
const SALES_OVERVIEW_QUERY_KEY = ["dashboard-sales-overview"];

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
 * Hook for fetching ONLY the sales overview data for the chart.
 */
export function useSalesOverview() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<SalesOverviewResponse>({
    queryKey: SALES_OVERVIEW_QUERY_KEY,
    queryFn: () => dashboardService.getSalesOverview(),
    enabled: !isAuthLoading && isAuthenticated,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}


/**
 * Optional: A convenience hook that combines all dashboard queries.
 * This can be useful if a page truly needs to wait for all data.
 * It uses `useQueries` to run all fetches in parallel.
 * --- UPDATED ---
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
            },
            // --- NEW ---
            {
                queryKey: SALES_OVERVIEW_QUERY_KEY,
                queryFn: () => dashboardService.getSalesOverview(),
                enabled: !isAuthLoading && isAuthenticated,
                staleTime: 1000 * 60 * 5,
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
        // --- NEW ---
        salesOverviewData: results[2].data as SalesOverviewResponse | undefined,
    }
}