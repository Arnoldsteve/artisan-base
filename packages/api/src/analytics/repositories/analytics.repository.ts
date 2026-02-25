import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * SOLID Principle: Single Responsibility
 * This repository handles high-performance pre-aggregation logic.
 * It ensures the dashboard charts load instantly by maintaining 
 * daily summary rows.
 */
@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * TOP 1% LOGIC: Atomic Revenue Increment
   * millions of users: We use 'upsert' to prevent race conditions. 
   * If two orders happen at the same time, the totals are added correctly.
   */
  async incrementDailyRevenue(tenantId: string, amount: number) {
    // We normalize the date to the start of the day for the dateKey
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return this.prisma.analyticsDailyRevenue.upsert({
      where: {
        tenantId_dateKey: {
          tenantId,
          dateKey: today,
        },
      },
      update: {
        totalRevenue: { increment: amount },
        orderCount: { increment: 1 },
      },
      create: {
        tenantId,
        dateKey: today,
        totalRevenue: amount,
        orderCount: 1,
      },
    });
  }

  /**
   * Fetches daily revenue stats for the last X days.
   * millions of users: Used by the Dashboard Line Chart.
   */
  async getDailyStats(tenantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - days);

    return this.prisma.client.analyticsDailyRevenue.findMany({
      where: {
        dateKey: { gte: startDate },
      },
      orderBy: { dateKey: 'asc' },
    });
  }
}