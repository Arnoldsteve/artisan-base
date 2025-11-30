import { Decimal } from "decimal.js";

/* ===========================
   GLOBAL
=========================== */

export type DateRangePreset = "7d" | "30d" | "90d" | "1y" | "custom";

export type GroupBy = "day" | "week" | "month" | "year";

export interface DateRangeFilter {
  preset?: DateRangePreset;
  startDate?: string; // ISO
  endDate?: string; // ISO
  compareWithPrevious?: boolean;
}

/* ===========================
   OVERVIEW (Dashboard Home)
=========================== */

export interface RevenueOverview {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  refundedRevenue: number;
  averageOrderValue: number;
}

export interface OrdersOverview {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageProcessingTime: number; // hours or days
}

export interface CustomersOverview {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageLifetimeValue: number;
}

export interface ProductsOverview {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
}

export interface AnalyticsOverviewResponse {
  revenue: RevenueOverview;
  orders: OrdersOverview;
  customers: CustomersOverview;
  products: ProductsOverview;
}

/* ===========================
   REPORTS PAGE TYPES
=========================== */

/* ---- Revenue Trend ---- */
export interface RevenueTrendPoint {
  date: string; // ISO
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface RevenueTrendResponse {
  groupBy: GroupBy;
  data: RevenueTrendPoint[];
}

/* ---- Order Funnel ---- */
export interface OrderFunnelStage {
  stage: "pending" | "paid" | "packed" | "shipped" | "delivered" | "refunded";
  count: number;
  percentageDrop?: number;
}

export interface OrderFunnelResponse {
  stages: OrderFunnelStage[];
}

/* ---- Revenue by Category ---- */
export interface RevenueByCategoryItem {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

export type RevenueByCategoryResponse = RevenueByCategoryItem[];

/* ---- Payment Methods ---- */
export type PaymentMethod = "mpesa" | "card" | "cash" | "bank_transfer";

export interface PaymentMethodAnalytics {
  method: PaymentMethod;
  transactions: number;
  successRate: number;
  revenue: number;
}

export type PaymentMethodsResponse = PaymentMethodAnalytics[];

/* ---- Best Selling Products ---- */
export interface BestSellingProduct {
  rank: number;
  productId: string;
  productName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  averagePrice: number;
  stock: number;
}

export type BestSellingProductsResponse = BestSellingProduct[];

/* ---- Top Customers ---- */
export interface TopCustomerAnalytics {
  rank: number;
  customerId: string;
  fullName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
}

export type TopCustomersResponse = TopCustomerAnalytics[];

/* ---- Recent Transactions ---- */
export interface RecentTransaction {
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: "paid" | "pending" | "refunded";
  createdAt: string;
}

export type RecentTransactionsResponse = RecentTransaction[];

/* ---- Refunds & Returns ---- */
export interface RefundAnalytics {
  orderId: string;
  reason: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type RefundsResponse = RefundAnalytics[];

/* ===========================
   SALES & MARKETING PAGE
=========================== */

/* ---- Sales Velocity ---- */
export interface SalesVelocityResponse {
  revenuePerDay: number;
  ordersPerDay: number;
  peakSalesDay: string; // Monday, Tuesday...
  peakSalesHour?: number; // 0–23
}

/* ---- Sales by Day of Week ---- */
export interface SalesByDayOfWeek {
  day: string; // Monday - Sunday
  orders: number;
  revenue: number;
}

export type SalesByDayOfWeekResponse = SalesByDayOfWeek[];

/* ---- Hourly Sales Pattern ---- */
export interface HourlySalesPoint {
  hour: number; // 0–23
  orders: number;
  revenue: number;
}

export type HourlySalesResponse = HourlySalesPoint[];

/* ---- Sales By Location ---- */
export interface SalesByLocation {
  location: string; // city | region | country
  orders: number;
  revenue: number;
  averageOrderValue: number;
  shippingCost?: number;
}

export type SalesByLocationResponse = SalesByLocation[];

/* ---- Customer Segmentation ---- */
export interface CustomerSegmentationResponse {
  newCustomersPercentage: number;
  returningCustomersPercentage: number;
  vipCustomersPercentage: number;
}

/* ---- Customer Lifetime Value ---- */
export interface CustomerLifetimeValueResponse {
  averageCLV: number;
  distribution: {
    low: number;
    medium: number;
    high: number;
  };
}

/* ---- Customer Retention ---- */
export interface CustomerRetentionResponse {
  repeatPurchaseRate: number;
  averageDaysBetweenOrders: number;
}

/* ---- Product Performance Matrix ---- */
export type ProductPerformanceQuadrant =
  | "star"
  | "cash_cow"
  | "question_mark"
  | "dog";

export interface ProductPerformanceMatrixItem {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  quadrant: ProductPerformanceQuadrant;
}

export type ProductPerformanceMatrixResponse = ProductPerformanceMatrixItem[];

/* ---- Inactive Products ---- */
export interface InactiveProductAnalytics {
  productId: string;
  productName: string;
  lastSoldAt?: string;
  daysInactive: number;
  stock: number;
}

export type InactiveProductsResponse = InactiveProductAnalytics[];
