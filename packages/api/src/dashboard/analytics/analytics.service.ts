import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import {
  DateRangeDto,
  RevenueTrendQueryDto,
  TopItemsQueryDto,
  SalesByLocationQueryDto,
  InactiveProductsQueryDto,
  CustomerRetentionQueryDto,
} from './dto/analytics.dto';
import { AnalyticsRepository } from './analytics.repository';

@Injectable({ scope: Scope.REQUEST })
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  /**
   * Convert a single ISO string to Date or undefined
   */
  private toDate(dateString?: string): Date | undefined {
    return dateString ? new Date(dateString) : undefined;
  }

  /**
   * Convert two ISO strings to a tuple of Dates or undefined
   */
  private toDates(
    start?: string,
    end?: string,
  ): [Date | undefined, Date | undefined] {
    return [this.toDate(start), this.toDate(end)];
  }

  // =====================================================
  // OVERVIEW
  // =====================================================
  async getOverview(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    return this.analyticsRepository.getOverviewMetrics();
  }

  // =====================================================
  // REVENUE ANALYTICS
  // =====================================================
  async getRevenue(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    return this.analyticsRepository.getTotalRevenue();
  }

  async getRevenueTrend(query: RevenueTrendQueryDto) {
    const startDate = new Date(query.startDate!);
    const endDate = new Date(query.endDate!);
    return this.analyticsRepository.getRevenueTrend();
  }

  async getRevenueByCategory(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    return this.analyticsRepository.getRevenueByCategory();
  }

  async getRevenueByPaymentProvider(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    return this.analyticsRepository.getRevenueByPaymentProvider();
  }

  // =====================================================
  // SALES ANALYTICS
  // =====================================================
  async getSalesMetrics(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    return this.analyticsRepository.getOrderMetrics();
  }

  async getOrderStatusDistribution(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    return this.analyticsRepository.getOrderStatusDistribution();
  }

  async getSalesVelocity(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);

    if (!start || !end) {
      throw new BadRequestException('StartDate and EndDate are required');
    }
    return this.analyticsRepository.getSalesVelocity();
  }

  async getSalesByDayOfWeek(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    if (!start || !end) throw new BadRequestException('StartDate and EndDate are required');
    return this.analyticsRepository.getSalesByDayOfWeek();
  }

  async getSalesByHour(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    if (!start || !end) throw new BadRequestException('StartDate and EndDate are required');
    return this.analyticsRepository.getSalesByHour();
  }

  async getSalesByLocation(query: SalesByLocationQueryDto) {
    const [start, end] = this.toDates(query.startDate, query.endDate);
    return this.analyticsRepository.getSalesByLocation();
  }

  // =====================================================
  // CUSTOMER ANALYTICS
  // =====================================================
  async getCustomerMetrics(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    return this.analyticsRepository.getCustomerMetrics();
  }

  async getTopCustomers(query: TopItemsQueryDto) {
    const [start, end] = this.toDates(query.startDate, query.endDate);
    const limit = query.limit ?? 10;
    return this.analyticsRepository.getTopCustomers();
  }

  async getCustomerSegmentation() {
    return this.analyticsRepository.getCustomerSegmentation();
  }

  async getCustomerLifetimeValue() {
    return this.analyticsRepository.getCustomerLifetimeValue();
  }

  async getCustomerRetention(query: CustomerRetentionQueryDto) {
    return this.analyticsRepository.getCustomerRetention();
  }

  // =====================================================
  // PRODUCT ANALYTICS
  // =====================================================
  async getBestSellingProducts(query: TopItemsQueryDto) {
    const [start, end] = this.toDates(query.startDate, query.endDate);
    const limit = query.limit ?? 10;
    return this.analyticsRepository.getBestSellingProducts();
  }

  async getProductPerformanceMatrix(dateRange: DateRangeDto) {
    const [start, end] = this.toDates(dateRange.startDate, dateRange.endDate);
    if (!start || !end) throw new BadRequestException('StartDate and EndDate are required');
    return this.analyticsRepository.getProductPerformanceMatrix();
  }

  async getInactiveProducts(query: InactiveProductsQueryDto) {
    const days = query.days ?? 30;
    return this.analyticsRepository.getInactiveProducts();
  }

  async getProductMetrics() {
    return this.analyticsRepository.getProductMetrics();
  }
}
