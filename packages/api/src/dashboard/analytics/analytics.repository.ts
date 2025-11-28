import { Injectable } from '@nestjs/common';
import {
  IAnalyticsRepository,
  RevenueMetrics,
  RevenueTrendData,
  CategoryRevenueData,
  PaymentProviderData,
  OrderMetrics,
  OrderStatusData,
  SalesVelocityData,
  DayOfWeekData,
  HourlyData,
  CustomerMetrics,
  TopCustomerData,
  CustomerSegmentationData,
  CustomerLifetimeValueData,
  RetentionData,
  BestSellingProductData,
  ProductPerformanceData,
  InactiveProductData,
  ProductMetrics,
  LocationData,
  OverviewMetrics,
} from './interfaces/analytics-repository.interface';

@Injectable()
export class AnalyticsRepository implements IAnalyticsRepository {
  // =====================================================
  // OVERVIEW
  // =====================================================

  async getOverviewMetrics(): Promise<OverviewMetrics> {
    return {
      revenue: await this.getTotalRevenue(),
      orders: await this.getOrderMetrics(),
      customers: await this.getCustomerMetrics(),
      products: await this.getProductMetrics(),
    };
  }

  // =====================================================
  // REVENUE
  // =====================================================

  async getTotalRevenue(): Promise<RevenueMetrics> {
    return {
      totalRevenue: 250000,
      paidRevenue: 200000,
      pendingRevenue: 30000,
      refundedRevenue: 20000,
      averageOrderValue: 5200,
    };
  }

  async getRevenueTrend(): Promise<RevenueTrendData[]> {
    return [
      {
        period: '2025-01',
        revenue: 50000,
        orderCount: 120,
        averageOrderValue: 416,
      },
    ];
  }

  async getRevenueByCategory(): Promise<CategoryRevenueData[]> {
    return [
      {
        categoryId: 'cat-1',
        categoryName: 'Electronics',
        revenue: 120000,
        orderCount: 80,
        productCount: 32,
        percentage: 48,
      },
    ];
  }

  async getRevenueByPaymentProvider(): Promise<PaymentProviderData[]> {
    return [
      {
        provider: 'Stripe',
        revenue: 180000,
        orderCount: 160,
        successRate: 97,
        percentage: 72,
      },
    ];
  }

  // =====================================================
  // SALES
  // =====================================================

  async getOrderMetrics(): Promise<OrderMetrics> {
    return {
      totalOrders: 480,
      pendingOrders: 22,
      deliveredOrders: 430,
      cancelledOrders: 28,
      averageProcessingTime: 6,
    };
  }

  async getOrderStatusDistribution(): Promise<OrderStatusData[]> {
    return [
      { status: 'pending', count: 22, percentage: 4.5 },
      { status: 'delivered', count: 430, percentage: 89.6 },
      { status: 'cancelled', count: 28, percentage: 5.9 },
    ];
  }

  async getSalesVelocity(): Promise<SalesVelocityData> {
    return {
      ordersPerDay: 18,
      revenuePerDay: 8400,
      ordersPerWeek: 126,
      revenuePerWeek: 58800,
    };
  }

  async getSalesByDayOfWeek(): Promise<DayOfWeekData[]> {
    return [
      { dayOfWeek: 1, dayName: 'Monday', orderCount: 74, revenue: 9000 },
    ];
  }

  async getSalesByHour(): Promise<HourlyData[]> {
    return [{ hour: 10, orderCount: 28, revenue: 3200 }];
  }

  async getSalesByLocation(): Promise<LocationData[]> {
    return [
      {
        location: 'Nairobi',
        orderCount: 120,
        revenue: 78000,
        customerCount: 95,
        averageOrderValue: 650,
      },
    ];
  }

  // =====================================================
  // CUSTOMERS
  // =====================================================

  async getCustomerMetrics(): Promise<CustomerMetrics> {
    return {
      totalCustomers: 280,
      newCustomers: 34,
      returningCustomers: 190,
      averageLifetimeValue: 9200,
    };
  }

  async getTopCustomers(): Promise<TopCustomerData[]> {
    return [
      {
        customerId: 'cust-1',
        customerName: 'John Doe',
        email: 'john@example.com',
        totalOrders: 18,
        totalSpent: 42000,
        averageOrderValue: 2333,
        lastOrderDate: new Date(),
      },
    ];
  }

  async getCustomerSegmentation(): Promise<CustomerSegmentationData> {
    return {
      newCustomers: 34,
      returningCustomers: 190,
      vipCustomers: 56,
      atRiskCustomers: 18,
    };
  }

  async getCustomerLifetimeValue(): Promise<CustomerLifetimeValueData> {
    return {
      averageLifetimeValue: 9200,
      medianLifetimeValue: 7800,
      distribution: [
        { range: '0-5000', count: 90 },
        { range: '5000-15000', count: 140 },
        { range: '15000+', count: 50 },
      ],
    };
  }

  async getCustomerRetention(): Promise<RetentionData> {
    return {
      cohort: '2024-Q4',
      customersCount: 120,
      retentionRate: 68,
      repeatPurchaseRate: 54,
    };
  }

  // =====================================================
  // PRODUCTS
  // =====================================================

  async getBestSellingProducts(): Promise<BestSellingProductData[]> {
    return [
      {
        productId: 'prod-1',
        productName: 'iPhone 15',
        sku: 'APL-IP15',
        categoryName: 'Phones',
        unitsSold: 64,
        revenue: 96000,
        averagePrice: 1500,
        currentStock: 24,
      },
    ];
  }

  async getProductPerformanceMatrix(): Promise<ProductPerformanceData[]> {
    return [
      {
        productId: 'prod-1',
        productName: 'iPhone 15',
        unitsSold: 64,
        revenue: 96000,
        inventoryValue: 48000,
        turnoverRate: 1.8,
      },
    ];
  }

  async getInactiveProducts(): Promise<InactiveProductData[]> {
    return [
      {
        productId: 'prod-9',
        productName: 'Old Headphones',
        sku: 'OLD-HP',
        lastSaleDate: null,
        daysSinceLastSale: 180,
        currentStock: 42,
      },
    ];
  }

  async getProductMetrics(): Promise<ProductMetrics> {
    return {
      totalProducts: 540,
      activeProducts: 496,
      inactiveProducts: 44,
      lowStockProducts: 16,
      outOfStockProducts: 12,
      totalInventoryValue: 520000,
    };
  }
}
