import { Decimal } from 'decimal.js';
import { Order } from './orders';
import { Customer } from './customers';

export interface DashboardKPI {
  totalRevenue: string;
  salesToday: string;
  receivables: string;
  cashCollected: string;
  totalCustomers: number;
  activeProducts: number;
  inactiveProducts: number;
}

export interface SalesDataPoint {
  name: string;
  total: number;
}

export interface RecentOrdersResponse {
  recentOrders: Order[];
}

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
