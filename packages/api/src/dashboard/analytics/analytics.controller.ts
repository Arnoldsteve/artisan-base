import {
  Controller,
  Get,
  Query,
  Scope,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import {
  DateRangeDto,
  RevenueTrendQueryDto,
  TopItemsQueryDto,
  SalesByLocationQueryDto,
  InactiveProductsQueryDto,
  CustomerRetentionQueryDto,
} from './dto/analytics.dto';

@Controller({
  path: 'dashboard/analytics',
  scope: Scope.REQUEST,
})
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Overview/Dashboard
  @Get('overview')
  getOverview(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getOverview(dateRange);
  }

  // Revenue Analytics
  @Get('revenue')
  getRevenue(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getRevenue(dateRange);
  }

  @Get('revenue/trend')
  getRevenueTrend(@Query(ValidationPipe) query: RevenueTrendQueryDto) {
    return this.analyticsService.getRevenueTrend(query);
  }

  @Get('revenue/by-category')
  getRevenueByCategory(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getRevenueByCategory(dateRange);
  }

  @Get('revenue/by-payment-provider')
  getRevenueByPaymentProvider(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getRevenueByPaymentProvider(dateRange);
  }

  // Sales Analytics
  @Get('sales/metrics')
  getSalesMetrics(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getSalesMetrics(dateRange);
  }

  @Get('sales/order-status-distribution')
  getOrderStatusDistribution(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getOrderStatusDistribution(dateRange);
  }

  @Get('sales/velocity')
  getSalesVelocity(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getSalesVelocity(dateRange);
  }

  @Get('sales/by-day-of-week')
  getSalesByDayOfWeek(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getSalesByDayOfWeek(dateRange);
  }

  @Get('sales/by-hour')
  getSalesByHour(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getSalesByHour(dateRange);
  }

  @Get('sales/by-location')
  getSalesByLocation(@Query(ValidationPipe) query: SalesByLocationQueryDto) {
    return this.analyticsService.getSalesByLocation(query);
  }

  // Customer Analytics
  @Get('customers/metrics')
  getCustomerMetrics(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getCustomerMetrics(dateRange);
  }

  @Get('customers/top-spenders')
  getTopCustomers(@Query(ValidationPipe) query: TopItemsQueryDto) {
    return this.analyticsService.getTopCustomers(query);
  }

  @Get('customers/segmentation')
  getCustomerSegmentation() {
    return this.analyticsService.getCustomerSegmentation();
  }

  @Get('customers/lifetime-value')
  getCustomerLifetimeValue() {
    return this.analyticsService.getCustomerLifetimeValue();
  }

  @Get('customers/retention')
  getCustomerRetention(@Query(ValidationPipe) query: CustomerRetentionQueryDto) {
    return this.analyticsService.getCustomerRetention(query);
  }

  // Product Analytics
  @Get('products/best-selling')
  getBestSellingProducts(@Query(ValidationPipe) query: TopItemsQueryDto) {
    return this.analyticsService.getBestSellingProducts(query);
  }

  @Get('products/performance-matrix')
  getProductPerformanceMatrix(@Query(ValidationPipe) dateRange: DateRangeDto) {
    return this.analyticsService.getProductPerformanceMatrix(dateRange);
  }

  @Get('products/inactive')
  getInactiveProducts(@Query(ValidationPipe) query: InactiveProductsQueryDto) {
    return this.analyticsService.getInactiveProducts(query);
  }

  @Get('products/metrics')
  getProductMetrics() {
    return this.analyticsService.getProductMetrics();
  }
}