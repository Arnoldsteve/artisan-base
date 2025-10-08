import { Decimal } from 'decimal.js';
import { Order } from './orders';
import { Customer } from './customers';

// ============================================================================
// Data shapes for the main dashboard view
// ============================================================================

/**
 * Defines the shape of the Key Performance Indicator (KPI) stats object.
 */
// export interface DashboardKPI {
//   totalRevenue: Decimal;
//   salesToday: Decimal; // Renamed from 'sales' for clarity
//   totalCustomers: number;
//   activeProducts: number;
//   inactiveProducts: number;
// }


export interface DashboardKPI {
  totalRevenue: string;
  salesToday: string;
  receivables: string;
  cashCollected: string;
  totalCustomers: number;
  activeProducts: number;
  inactiveProducts: number;
}

/**
 * Defines a single data point for a sales overview chart.
 */
export interface SalesDataPoint {
  name: string;
  total: number;
}

/**
 * --- THIS IS THE FIX ---
 * Defines the shape of the response from the GET /dashboard/recent-orders endpoint.
 */
export interface RecentOrdersResponse {
  recentOrders: Order[];
}

/**
 * (Optional) Defines the shape of the combined data for the `useDashboardData` hook if used.
 * Note: We are now using separate hooks, so this is less critical but good for reference.
 */
export interface DashboardData {
  kpis: DashboardKPI;
  sales: SalesDataPoint[];
  recentOrders: Order[];
}

export interface SalesOverviewItem {
  name: string;   // e.g., "Jun"
  total: string;  // e.g., "47.94"
}

export interface SalesOverviewResponse {
  sales: SalesOverviewItem[];
}
