export interface DashboardKPI {
  totalRevenue: number;
  sales: number;
  newCustomers: number;
  activeProducts: number;
  inactiveProducts: number;
}

export interface SalesDataPoint {
  name: string;
  total: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

export type PaymentStatus = "PAID" | "PENDING" | "REFUNDED";

export interface RecentOrder {
  customer: Customer;
  totalAmount: number;
  paymentStatus: PaymentStatus;
}

export interface DashboardData {
  kpis: DashboardKPI;
  sales: SalesDataPoint[];
  recentOrders: RecentOrder[];
}
