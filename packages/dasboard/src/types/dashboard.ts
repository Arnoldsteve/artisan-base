// File: packages/dasboard/src/types/dashboard.ts

import { Decimal } from 'decimal.js';
import { Order } from './orders'; // Import the full Order type for consistency
import { Customer } from './customers'; // Import the main Customer type

// ============================================================================
// Data shapes for the main dashboard view
// ============================================================================

/**
 * Defines the shape of the Key Performance Indicator (KPI) stats object.
 */
export interface DashboardKPI {
  totalRevenue: Decimal; // <-- CORRECT TYPE for monetary values
  sales: Decimal;        // <-- CORRECT TYPE for monetary values
  newCustomers: number;
  activeProducts: number;
  inactiveProducts: number;
}

/**
 * Defines a single data point for a sales overview chart.
 */
export interface SalesDataPoint {
  name: string; // e.g., "Jan", "Feb", "Mar" or a specific date
  total: number; // The value for that point (can be sales amount or order count)
}

/**
 * Defines the shape of the entire data payload for the main dashboard page,
 * as returned by the GET /dashboard API endpoint.
 */
export interface DashboardData {
  kpis: DashboardKPI;
  sales: SalesDataPoint[];
  // Use the existing, full `Order` type for recent orders to maintain consistency
  // and have access to all order details if needed.
  recentOrders: Order[];
}