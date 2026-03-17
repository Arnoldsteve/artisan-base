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

/**
 * Represents the distribution of orders across different statuses
 * Used for funnel visualization in the analytics dashboard.
 */
export interface OrderStatusData {
  status: string;    // e.g., "PENDING", "SHIPPED", "DELIVERED"
  count: number;     // Total number of orders in this status
  percentage: number; // Contribution to the total (0-100)
  color?: string;    // Optional: Hex or Tailwind class for UI consistency
}

/**
 * Metadata for a single best-selling product record
 */
export interface BestSellingProduct {
  productId: string;
  productName: string;
  category: string | null;
  unitsSold: number;
  revenue: number;
  stock: number;
}

export interface RevenueByCategoryData {
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface AnalyticsOverviewResponse {
  revenue: {
    totalRevenue: number;
    paidRevenue: number;
    pendingRevenue: number;
    averageOrderValue: number;
  };
  orders: {
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    averageProcessingTime: number;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    averageLifetimeValue: number;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    totalInventoryValue: number;
  };
}