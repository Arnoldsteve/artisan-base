// ============================================
// INTERFACES
// ============================================

// analytics-repository.interface.ts
export interface IAnalyticsRepository {
  // Revenue Analytics
  getTotalRevenue(startDate?: Date, endDate?: Date): Promise<RevenueMetrics>;

  getRevenueTrend(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month' | 'year',
  ): Promise<RevenueTrendData[]>;

  getRevenueByCategory(
    startDate?: Date,
    endDate?: Date,
  ): Promise<CategoryRevenueData[]>;

  getRevenueByPaymentProvider(
    startDate?: Date,
    endDate?: Date,
  ): Promise<PaymentProviderData[]>;

  // Sales Analytics
  getOrderMetrics(startDate?: Date, endDate?: Date): Promise<OrderMetrics>;

  getOrderStatusDistribution(
    startDate?: Date,
    endDate?: Date,
  ): Promise<OrderStatusData[]>;

  getSalesVelocity(startDate: Date, endDate: Date): Promise<SalesVelocityData>;

  getSalesByDayOfWeek(startDate: Date, endDate: Date): Promise<DayOfWeekData[]>;

  getSalesByHour(startDate: Date, endDate: Date): Promise<HourlyData[]>;

  // Customer Analytics
  getCustomerMetrics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<CustomerMetrics>;

  getTopCustomers(
    limit: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TopCustomerData[]>;

  getCustomerSegmentation(): Promise<CustomerSegmentationData>;

  getCustomerLifetimeValue(): Promise<CustomerLifetimeValueData>;

  getCustomerRetention(
    cohortPeriod: 'month' | 'quarter' | 'year',
  ): Promise<RetentionData>;

  // Product Analytics
  getBestSellingProducts(
    limit: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BestSellingProductData[]>;

  getProductPerformanceMatrix(
    startDate: Date,
    endDate: Date,
  ): Promise<ProductPerformanceData[]>;

  getInactiveProducts(days: number): Promise<InactiveProductData[]>;

  getProductMetrics(): Promise<ProductMetrics>;

  // Geographic Analytics
  getSalesByLocation(
    groupBy: 'city' | 'state' | 'country',
    startDate?: Date,
    endDate?: Date,
  ): Promise<LocationData[]>;

  // Overview/Dashboard
  getOverviewMetrics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<OverviewMetrics>;
}

// ============================================
// RESPONSE TYPES (for repository returns)
// ============================================

export interface RevenueMetrics {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  refundedRevenue: number;
  averageOrderValue: number;
}

export interface RevenueTrendData {
  period: string; // e.g., "2024-01", "2024-W01", "2024-01-15"
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface CategoryRevenueData {
  categoryId: string;
  categoryName: string;
  revenue: number;
  orderCount: number;
  productCount: number;
  percentage: number;
}

export interface PaymentProviderData {
  provider: string;
  revenue: number;
  orderCount: number;
  successRate: number;
  percentage: number;
}

export interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageProcessingTime: number; // in hours
}

export interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface SalesVelocityData {
  ordersPerDay: number;
  revenuePerDay: number;
  ordersPerWeek: number;
  revenuePerWeek: number;
}

export interface DayOfWeekData {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  dayName: string;
  orderCount: number;
  revenue: number;
}

export interface HourlyData {
  hour: number; // 0-23
  orderCount: number;
  revenue: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageLifetimeValue: number;
}

export interface TopCustomerData {
  customerId: string;
  customerName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date;
}

export interface CustomerSegmentationData {
  newCustomers: number;
  returningCustomers: number;
  vipCustomers: number; // 5+ orders
  atRiskCustomers: number; // no purchase in 90+ days
}

export interface CustomerLifetimeValueData {
  averageLifetimeValue: number;
  medianLifetimeValue: number;
  distribution: {
    range: string; // e.g., "0-10000"
    count: number;
  }[];
}

export interface RetentionData {
  cohort: string;
  customersCount: number;
  retentionRate: number;
  repeatPurchaseRate: number;
}

export interface BestSellingProductData {
  productId: string;
  productName: string;
  sku: string;
  categoryName?: string;
  unitsSold: number;
  revenue: number;
  averagePrice: number;
  currentStock: number;
}

export interface ProductPerformanceData {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  inventoryValue: number;
  turnoverRate: number;
}

export interface InactiveProductData {
  productId: string;
  productName: string;
  sku: string;
  lastSaleDate: Date | null;
  daysSinceLastSale: number;
  currentStock: number;
}

export interface ProductMetrics {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
}

export interface LocationData {
  location: string; // city/state/country name
  orderCount: number;
  revenue: number;
  customerCount: number;
  averageOrderValue: number;
}

export interface OverviewMetrics {
  revenue: RevenueMetrics;
  orders: OrderMetrics;
  customers: CustomerMetrics;
  products: ProductMetrics;
}
