import { apiClient } from "@/lib/client-api";
import { AnalyticsSummaryResponse } from "@/types/analytics";

/**
 * SOLID Principle: Single Responsibility
 * This service handles data fetching for business intelligence and reporting.
 * It consumes the pre-aggregated summary endpoints for maximum performance.
 */
export class AnalyticsService {
  /**
   * millions of users: Fetches the combined KPI and Chart data.
   * This is the primary data source for the Dashboard Home Page.
   */
  async getSummary(): Promise<AnalyticsSummaryResponse> {
    // Matches the backend route: GET /api/v1/analytics/summary
    console.log("Fetching analytics summary...");
    const response=  apiClient.get<AnalyticsSummaryResponse>("/analytics/summary");
    console.log("Received analytics summary", response);
    return response;
  }

  /**
   * Prepared for Scale: You can add more granular report methods here later,
   * such as 'getRevenueByCategory' or 'getTopProducts'.
   */
}

export const analyticsService = new AnalyticsService();