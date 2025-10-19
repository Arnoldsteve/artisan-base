"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard-service";
import { DashboardKPI, RecentOrdersResponse, SalesOverviewResponse } from "@/types/dashboard";
import { useAuthContext } from "@/contexts/auth-context";

const KPIS_QUERY_KEY = ["dashboard-kpis"];
const RECENT_ORDERS_QUERY_KEY = ["dashboard-recent-orders"];
const SALES_OVERVIEW_QUERY_KEY = ["dashboard-sales-overview"];

export function useDashboardKpis() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<DashboardKPI>({
    queryKey: KPIS_QUERY_KEY,
    queryFn: () => dashboardService.getKpis(),
    enabled: !isAuthLoading && isAuthenticated,
    staleTime: 1000 * 60 * 5, 
  });
}

export function useRecentOrders() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<RecentOrdersResponse>({
    queryKey: RECENT_ORDERS_QUERY_KEY,
    queryFn: () => dashboardService.getRecentOrders(),
    enabled: !isAuthLoading && isAuthenticated,
    staleTime: 1000 * 60, 
  });
}

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

    const isLoading = results.some(query => query.isLoading);
    const isError = results.some(query => query.isError);

    return {
        isLoading,
        isError,
        kpis: results[0].data as DashboardKPI | undefined,
        recentOrdersData: results[1].data as RecentOrdersResponse | undefined,
        salesOverviewData: results[2].data as SalesOverviewResponse | undefined,
    }
}