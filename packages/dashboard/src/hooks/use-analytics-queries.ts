"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics-service";
import { useAuthContext } from "@/contexts/auth-context";
import { OrderStatusData, RevenueByCategoryData } from "@/types";



/**
 * TOP 1% ARCHITECTURE: Isolated Analytics Hooks
 * Each hook includes the tenantId in the queryKey to prevent data leakage 
 * when switching stores in the dashboard.
 */

// 1. Hook for Top Performing Products
export const useBestSellingProducts = ({ limit = 5 }: { limit?: number } = {}) => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ["analytics", tenantId, "best-sellers", limit],
    queryFn: () => analyticsService.getBestSellingProducts(limit),
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Hook for Order Status Distribution (Funnel)
export const useOrderStatusDistribution = () => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery<OrderStatusData[]>({
    queryKey: ["analytics", tenantId, "order-status-distribution"],
    queryFn: () => analyticsService.getOrderStatusDistribution(),
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 5,
  });
};
// 3. Hook for Recent Transactions in Reports
export const useRecentTransactions = ({ limit = 10 }: { limit?: number } = {}) => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ["analytics", tenantId, "recent-transactions", limit],
    queryFn: () => analyticsService.getRecentTransactions(limit),
    enabled: isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
  });
};

// 4. Hook for Refunds and Returns
export const useRefundsAndReturns = () => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ["analytics", tenantId, "refunds-returns"],
    queryFn: () => analyticsService.getRefundsAndReturns(),
    enabled: isAuthenticated && !!tenantId,
  });
};

// 5. Hook for Detailed Revenue Breakdown
export const useRevenueBreakdown = (timeframe = "month") => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ["analytics", tenantId, "revenue-breakdown", timeframe],
    queryFn: () => analyticsService.getRevenueBreakdown(timeframe),
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};


// 6. Hook for Revenue by Payment Method (e.g. M-Pesa vs Card)
export const usePaymentMethods = () => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery<any[]>({ 
    queryKey: ["analytics", tenantId, "payment-methods"],
    queryFn: () => analyticsService.getPaymentMethodStats(), // Ensure this exists in analyticsService
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 15, // 15 minutes (Financial distribution is less volatile)
  });
};

// 7. Hook for Revenue grouped by Product Categories
export const useRevenueByCategory = () => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery<RevenueByCategoryData[]>({
    queryKey: ["analytics", tenantId, "revenue-category"],
    queryFn: () => analyticsService.getRevenueByCategory(),
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 15,
  });
};


// 8. Hook for Revenue and Orders Trend (Time-series)
export const useRevenueTrend = ({ 
  groupBy = "day" 
}: { 
  groupBy?: "day" | "week" | "month" | "year" 
} = {}) => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ["analytics", tenantId, "revenue-trend", groupBy],
    queryFn: () => analyticsService.getRevenueTrend(groupBy), // ⚡ Ensure this exists in service
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 9. Master Hook for the Reports Overview Page
export const useAnalyticsOverview = (filters: any = {}) => {
  const { tenantId, isAuthenticated } = useAuthContext();

  return useQuery({
    // Include filters in the key so that changing dates/categories refetches the KPIs
    queryKey: ["analytics", tenantId, "overview", filters],
    queryFn: () => analyticsService.getAnalyticsOverview(filters), 
    enabled: isAuthenticated && !!tenantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};