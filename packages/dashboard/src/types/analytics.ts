/**
 * SOLID Principle: Single Source of Truth
 * These interfaces define the data returned by the high-performance 
 * analytics pre-aggregation engine.
 */

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  daysTracked: number;
  // Prepared for growth: 
  // totalCustomers?: number;
  // revenueChangePercentage?: number;
}

export interface DailyChartData {
  date: string; // ISO date string (YYYY-MM-DD)
  revenue: number;
  orders: number;
}

/**
 * Primary response for the Dashboard Home Page
 */
export interface AnalyticsSummaryResponse {
  overview: DashboardOverview;
  chartData: DailyChartData[];
}