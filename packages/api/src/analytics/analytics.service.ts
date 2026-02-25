import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { OrderRepository } from '../order/repositories/order.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly analyticsRepo: AnalyticsRepository,
    private readonly orderRepo: OrderRepository,
  ) {}

  async getDashboardSummary(tenantId: string) {
    // 1. PERFORMANCE: Fetch 60 days of pre-aggregated data in one trip
    // millions of users: This is much faster than running two separate queries
    const sixtyDayStats = await this.analyticsRepo.getDailyStats(tenantId, 60);

    // 2. DATA SPLITTING: 
    // Current Period = 0 to 29 days ago
    // Previous Period = 30 to 59 days ago
    const currentPeriod = sixtyDayStats.filter(s => s.dateKey >= this.getDaysAgo(30));
    const previousPeriod = sixtyDayStats.filter(s => s.dateKey < this.getDaysAgo(30));

    // 3. AGGREGATION: Calculate totals for both periods
    const currentRevenue = currentPeriod.reduce((sum, s) => sum + Number(s.totalRevenue), 0);
    const previousRevenue = previousPeriod.reduce((sum, s) => sum + Number(s.totalRevenue), 0);

    const currentOrders = currentPeriod.reduce((sum, s) => sum + s.orderCount, 0);
    const previousOrders = previousPeriod.reduce((sum, s) => sum + s.orderCount, 0);

    // 4. LOGIC: Calculate Percentage Trends
    const revenueTrend = this.calculateTrend(currentRevenue, previousRevenue);
    const ordersTrend = this.calculateTrend(currentOrders, previousOrders);

    // 5. LIVE STATS: Real-time count
    const totalOrdersCount = await this.orderRepo.count();

    return {
      overview: {
        totalRevenue: currentRevenue,
        revenueTrend, // e.g. 12.5 (meaning +12.5%)
        totalOrders: totalOrdersCount,
        ordersTrend,
        avgOrderValue: currentOrders > 0 ? currentRevenue / currentOrders : 0,
        daysTracked: sixtyDayStats.length,
      },
      // Front-end only needs the last 30 days for the chart
      chartData: currentPeriod.map(stat => ({
        date: stat.dateKey.toISOString().split('T')[0],
        revenue: Number(stat.totalRevenue),
        orders: stat.orderCount,
      })),
    };
  }

  // --- TOP 1% PRIVATE HELPERS ---

  /**
   * Calculates percentage change between two numbers.
   * millions of users: Handles division by zero for new stores.
   */
  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    const change = ((current - previous) / previous) * 100;
    return parseFloat(change.toFixed(1)); // Return rounded to 1 decimal
  }

  private getDaysAgo(days: number): Date {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - days);
    return date;
  }
}