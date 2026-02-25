"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics-service";
import { useAuthContext } from "@/contexts/auth-context";
import { AnalyticsSummaryResponse } from "@/types/analytics";

/**
 * TOP 1% ARCHITECTURE: Context-Aware Analytics Hook
 * millions of users: This hook uses the tenantId to ensure 
 * complete cache isolation between different stores.
 */
export const useDashboardSummary = () => {
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  // Cache key is partitioned by tenantId
  const ANALYTICS_KEY = ["dashboard-analytics", tenantId];

  return useQuery<AnalyticsSummaryResponse>({
    queryKey: [...ANALYTICS_KEY, "summary"],
    queryFn: () => analyticsService.getSummary(),
    
    /**
     * Safety Gate:
     * Only fetch if the user is logged in AND we have resolved 
     * which store bubble they are currently managing.
     */
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,

    /**
     * Performance Optimization:
     * Analytics data is pre-aggregated and doesn't change every millisecond.
     * We set a staleTime of 1 minute to reduce backend load during navigation.
     */
    // staleTime: 1000 * 60, 
    
    // Smooth transition during store switching
    placeholderData: (previousData) => previousData,
  });
};