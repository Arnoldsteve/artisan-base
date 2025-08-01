// File: packages/dasboard/src/services/dashboard-service.ts

import { apiClient } from "@/lib/client-api";
import { DashboardData } from "@/types/dashboard"; // <-- Import our new type

/**
 * DashboardService directly handles API communication for the main dashboard view.
 */
export class DashboardService {
  /**
   * Fetches the aggregated data required for the main dashboard.
   * This includes stats, recent orders, etc.
   * On failure, the apiClient will throw a structured ApiError.
   */
  async getDashboardData(): Promise<DashboardData> {
    // This assumes you will create a single, efficient endpoint on your backend
    // that gathers all this data in one go.
    return apiClient.get<DashboardData>("/dashboard");
  }
}

// Export a singleton instance of the service for use in hooks and components
export const dashboardService = new DashboardService();