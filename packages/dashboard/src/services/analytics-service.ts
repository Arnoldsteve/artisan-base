import { apiClient } from "@/lib/client-api";
import { AnalyticsSummaryResponse, BestSellingProduct, OrderStatusData, RevenueByCategoryData } from "@/types";

/**
 * SOLID Principle: Single Responsibility
 * This service handles all business intelligence data retrieval.
 * It leverages the x-tenant-id header in apiClient for row-level isolation.
 */
export class AnalyticsService {
  /**
   * millions of users: Fetches the high-level KPI and primary chart data.
   */
  async getSummary(): Promise<AnalyticsSummaryResponse> {
    return apiClient.get<AnalyticsSummaryResponse>("/analytics/summary");
  }

  /**
   * PERFORMANCE: Fetches top products by volume/revenue.
   * Backend uses the AnalyticsBestSellingProducts pre-aggregated table.
   */
  async getBestSellingProducts(limit: number): Promise<BestSellingProduct[]> {
    return apiClient.get<BestSellingProduct[]>(`/analytics/best-sellers?limit=${limit}`);
  }

  /**
   * VISUALIZATION: Returns the breakdown of orders by status.
   * millions of users: Crucial for identifying bottleneck in fulfillment.
   */
  async getOrderStatusDistribution(): Promise<OrderStatusData[]> {
    return apiClient.get<OrderStatusData[]>("/analytics/order-status");
  }

  /**
   * REPORTING: Fetches recent financial events across the store.
   */
  async getRecentTransactions(limit = 10): Promise<any[]> {
    return apiClient.get<any[]>("/analytics/recent-transactions", { limit });
  }

  /**
   * FINANCIAL HEALTH: Fetches loss/return data.
   */
  async getRefundsAndReturns(): Promise<any> {
    return apiClient.get<any>("/analytics/refunds-returns");
  }

  /**
   * TIME-SERIES: Fetches detailed revenue over specific intervals.
   * timeframe: 'day' | 'week' | 'month' | 'year'
   */
  async getRevenueBreakdown(timeframe: string): Promise<any> {
    return apiClient.get<any>("/analytics/revenue-breakdown", { timeframe });
  }

 async getPaymentMethodStats(): Promise<any[]> {
    return apiClient.get<any[]>("/analytics/revenue/payment-methods");
  }
  async getRevenueByCategory(): Promise<RevenueByCategoryData[]> {
    return apiClient.get<RevenueByCategoryData[]>("/analytics/revenue/categories");
  }

  async getRevenueTrend(groupBy: string): Promise<any[]> {
    return apiClient.get<any[]>(`/analytics/revenue/trend`, {
      params: { groupBy }
    });
  }

  async getAnalyticsOverview(filters: any): Promise<any> {
    return apiClient.get("/analytics/overview", {
      params: filters
    });
  }
}

export const analyticsService = new AnalyticsService();