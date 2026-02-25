/**
 * SOLID Principle: Single Source of Truth
 * Refactored to include growth trends for intelligent dashboard insights.
 */

export interface DashboardOverview {
  totalRevenue: number;
  revenueTrend: number; // ✅ NEW: Percentage change vs previous 30 days
  
  totalOrders: number;
  ordersTrend: number;  // ✅ NEW: Percentage change vs previous 30 days
  
  avgOrderValue: number;
  daysTracked: number;
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