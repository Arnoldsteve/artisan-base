import { apiClient } from "@/lib/client-api";
import { DashboardKPI, RecentOrdersResponse, SalesOverviewResponse } from "@/types/dashboard"; 

export class DashboardService {
 
  async getKpis(): Promise<DashboardKPI> {
    return apiClient.get<DashboardKPI>("/dashboard/admin-home/kpis");
  }

   async getRecentOrders(): Promise<RecentOrdersResponse> {
    return apiClient.get<RecentOrdersResponse>("/dashboard/admin-home/recent-orders");
  }

  async getSalesOverview(): Promise<SalesOverviewResponse> {
    return apiClient.get<SalesOverviewResponse>("/dashboard/admin-home/sales-overview");
  }

}

export const dashboardService = new DashboardService();