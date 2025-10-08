import { Order } from "../../../../generated/tenant";

// This is a cleaner DTO that only includes what the UI needs for recent orders.
// It omits sensitive or large fields.
class RecentOrderDto {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: string; // Represent Decimal as string
  createdAt: Date;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
}

// export class DashboardKpisResponseDto {
//   totalRevenue: string;
//   salesToday: string;
//   totalCustomers: number;
//   activeProducts: number;
//   inactiveProducts: number;
// }


export class DashboardKpisResponseDto {
  totalRevenue: string;      // Delivered + Paid
  salesToday: string;        // Delivered today + Paid
  receivables: string;       // Delivered but Unpaid
  cashCollected: string;     // Actual payments received
  totalCustomers: number;
  activeProducts: number;
  inactiveProducts: number;
}

export class DashboardRecentOrdersResponseDto {
    recentOrders: RecentOrderDto[];
}

class SalesDataPointDto {
  name: string; // e.g., "Jan", "Feb"
  total: string; // The total sales for that month (as a string)
}

export class SalesOverviewResponseDto {
  sales: SalesDataPointDto[];
}