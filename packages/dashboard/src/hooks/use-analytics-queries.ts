import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics-service";
import { useAuthContext } from "@/contexts/auth-context";
import { toast } from "sonner";

import {
  AnalyticsOverviewResponse,
  RevenueTrendResponse,
  RevenueByCategoryResponse,
  PaymentMethodsResponse,
  BestSellingProductsResponse,
  TopCustomersResponse,
  SalesVelocityResponse,
  SalesByDayOfWeekResponse,
  HourlySalesResponse,
  SalesByLocationResponse,
  CustomerSegmentationResponse,
  CustomerLifetimeValueResponse,
  CustomerRetentionResponse,
  ProductPerformanceMatrixResponse,
  InactiveProductsResponse,
  OrderFunnelResponse,
} from "@/types/analytics";

/* ===========================
   QUERY KEYS
=========================== */

export const ANALYTICS_QUERY_KEY = ["dashboard-analytics"];

/* ===========================
   OVERVIEW (DASHBOARD HOME)
=========================== */

export function useAnalyticsOverview(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<AnalyticsOverviewResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "overview", params],
    queryFn: () => analyticsService.getOverview(params),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

/* ===========================
   REPORTS PAGE
=========================== */

export function useRevenueTrend(params: {
  groupBy: "day" | "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<RevenueTrendResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "revenue-trend", params],
    queryFn: () => analyticsService.getRevenueTrend(params),
    enabled: !isAuthLoading && isAuthenticated && !!params.groupBy,
  });
}

export function useRevenueByCategory(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<RevenueByCategoryResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "revenue-by-category", params],
    queryFn: () => analyticsService.getRevenueByCategory(params),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function usePaymentMethods(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaymentMethodsResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "payment-methods", params],
    queryFn: () => analyticsService.getPaymentMethods(params),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useBestSellingProducts(params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<BestSellingProductsResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "best-selling-products", params],
    queryFn: () => analyticsService.getBestSellingProducts(params),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useTopCustomers(params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<TopCustomersResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "top-customers", params],
    queryFn: () => analyticsService.getTopCustomers(params),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

/* ===========================
   SALES & MARKETING
=========================== */

export function useOrderStatusDistribution(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext(); 
  return useQuery<OrderFunnelResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "order-status-distribution", params],
    queryFn: () => analyticsService.getOrderStatusDistribution(params),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useSalesVelocity(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<SalesVelocityResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "sales-velocity", params],
    queryFn: () =>
      analyticsService
        .getSalesVelocity(params || {})
        .catch((err) => {
          toast.error(err.message || "Failed to load sales velocity");
          throw err;
        }),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useSalesByDayOfWeek(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<SalesByDayOfWeekResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "sales-by-day-of-week", params],
    queryFn: () => analyticsService.getSalesByDayOfWeek(params || {}),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useSalesByHour(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<HourlySalesResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "sales-by-hour", params],
    queryFn: () => analyticsService.getSalesByHour(params || {}),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useSalesByLocation(params: {
  groupBy: "city" | "state" | "country";
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<SalesByLocationResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "sales-by-location", params],
    queryFn: () => analyticsService.getSalesByLocation(params),
    enabled: !isAuthLoading && isAuthenticated && !!params.groupBy,
  });
}

/* ===========================
   CUSTOMER INTELLIGENCE
=========================== */

export function useCustomerSegmentation() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<CustomerSegmentationResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "customer-segmentation"],
    queryFn: () => analyticsService.getCustomerSegmentation(),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useCustomerLifetimeValue() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<CustomerLifetimeValueResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "customer-lifetime-value"],
    queryFn: () => analyticsService.getCustomerLifetimeValue(),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useCustomerRetention(params: {
  cohortPeriod: "month" | "quarter" | "year";
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<CustomerRetentionResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "customer-retention", params],
    queryFn: () => analyticsService.getCustomerRetention(params),
    enabled:
      !isAuthLoading &&
      isAuthenticated &&
      !!params?.cohortPeriod,
  });
}

/* ===========================
   PRODUCT PERFORMANCE
=========================== */

export function useProductPerformanceMatrix(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<ProductPerformanceMatrixResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "product-performance-matrix", params],
    queryFn: () =>
      analyticsService.getProductPerformanceMatrix(params || {}),
    enabled: !isAuthLoading && isAuthenticated,
  });
}

export function useInactiveProducts(params: {
  days: 30 | 60 | 90;
}) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<InactiveProductsResponse>({
    queryKey: [...ANALYTICS_QUERY_KEY, "inactive-products", params],
    queryFn: () => analyticsService.getInactiveProducts(params),
    enabled: !isAuthLoading && isAuthenticated,
    });
}
