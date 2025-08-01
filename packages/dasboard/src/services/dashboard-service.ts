// File: packages/dasboard/src/services/dashboard-service.ts

import { apiClient } from "@/lib/client-api";
// Import the specific response types
import { DashboardKPI, RecentOrdersResponse } from "@/types/dashboard"; 

/**
 * DashboardService handles API communication for the main dashboard,
 * fetching different pieces of data from dedicated endpoints.
 */
export class DashboardService {
  /**
   * Fetches only the Key Performance Indicators (KPIs).
   * This is a fast query for the main stats cards.
   */
  async getKpis(): Promise<DashboardKPI> {
    return apiClient.get<DashboardKPI>("/dashboard/admin-home/kpis");
  }

  /**
   * Fetches only the most recent orders.
   * This can be called separately to populate the recent orders table.
   */
  async getRecentOrders(): Promise<RecentOrdersResponse> {
    return apiClient.get<RecentOrdersResponse>("/dashboard/admin-home/recent-orders");
  }
}

// Export a singleton instance
export const dashboardService = new DashboardService();