import { apiClient } from "@/lib/client-api";
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
} from "@/types/analytics";

/* ===========================
   ANALYTICS SERVICE
=========================== */

export class AnalyticsService {
  /* ===========================
     OVERVIEW (Dashboard Home)
  =========================== */

  async getOverview(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AnalyticsOverviewResponse> {
    return apiClient.get<AnalyticsOverviewResponse>(
      "dashboard/analytics/overview",
      params
    );
  }

  /* ===========================
     REPORTS PAGE
  =========================== */

  async getRevenueTrend(params: {
    groupBy: "day" | "week" | "month" | "year";
    startDate?: string;
    endDate?: string;
  }): Promise<RevenueTrendResponse> {
    return apiClient.get<RevenueTrendResponse>(
      "dashboard/analytics/revenue/trend",
      params
    );
  }

  async getRevenueByCategory(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<RevenueByCategoryResponse> {
    return apiClient.get<RevenueByCategoryResponse>(
      "dashboard/analytics/revenue/by-category",
      params
    );
  }

  async getPaymentMethods(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<PaymentMethodsResponse> {
    return apiClient.get<PaymentMethodsResponse>(
      "dashboard/analytics/revenue/payment-methods",
      params
    );
  }

  async getBestSellingProducts(params?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<BestSellingProductsResponse> {
    return apiClient.get<BestSellingProductsResponse>(
      "dashboard/analytics/products/best-selling",
      params
    );
  }

  async getTopCustomers(params?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<TopCustomersResponse> {
    return apiClient.get<TopCustomersResponse>(
      "dashboard/analytics/customers/top",
      params
    );
  }

  /* ===========================
     SALES & MARKETING
  =========================== */

  async getSalesVelocity(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<SalesVelocityResponse> {
    return apiClient.get<SalesVelocityResponse>(
      "dashboard/analytics/sales/velocity",
      params
    );
  }

  async getSalesByDayOfWeek(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<SalesByDayOfWeekResponse> {
    return apiClient.get<SalesByDayOfWeekResponse>(
      "dashboard/analytics/sales/by-day-of-week",
      params
    );
  }

  async getSalesByHour(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<HourlySalesResponse> {
    return apiClient.get<HourlySalesResponse>(
      "dashboard/analytics/sales/by-hour",
      params
    );
  }

  async getSalesByLocation(params: {
    groupBy: "city" | "state" | "country";
    startDate?: string;
    endDate?: string;
  }): Promise<SalesByLocationResponse> {
    return apiClient.get<SalesByLocationResponse>(
      "dashboard/analytics/sales/by-location",
      params
    );
  }

  /* ===========================
     CUSTOMER INTELLIGENCE
  =========================== */

  async getCustomerSegmentation(): Promise<CustomerSegmentationResponse> {
    return apiClient.get<CustomerSegmentationResponse>(
      "dashboard/analytics/customers/segmentation"
    );
  }

  async getCustomerLifetimeValue(): Promise<CustomerLifetimeValueResponse> {
    return apiClient.get<CustomerLifetimeValueResponse>(
      "dashboard/analytics/customers/lifetime-value"
    );
  }

  async getCustomerRetention(params: {
    cohortPeriod: "month" | "quarter" | "year";
  }): Promise<CustomerRetentionResponse> {
    return apiClient.get<CustomerRetentionResponse>(
      "dashboard/analytics/customers/retention",
      params
    );
  }

  /* ===========================
     PRODUCT PERFORMANCE
  =========================== */

  async getProductPerformanceMatrix(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<ProductPerformanceMatrixResponse> {
    return apiClient.get<ProductPerformanceMatrixResponse>(
      "dashboard/analytics/products/performance-matrix",
      params
    );
  }

  async getInactiveProducts(params: {
    days: 30 | 60 | 90;
  }): Promise<InactiveProductsResponse> {
    return apiClient.get<InactiveProductsResponse>(
      "dashboard/analytics/products/inactive",
      params
    );
  }
}

/* ===========================
   SINGLETON EXPORT
=========================== */

export const analyticsService = new AnalyticsService();
