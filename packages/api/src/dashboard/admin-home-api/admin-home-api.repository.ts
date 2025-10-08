// File: packages/api/src/dashboard/admin-home-api/admin-home-api.repository.ts

import { Injectable, Logger, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IAdminHomeApiRepository } from './interfaces/admin-home-api-repository.interface';
import { Prisma, PrismaClient } from '../../../generated/tenant';
import { Decimal } from '@prisma/client/runtime/library';
import {
  DashboardKpisResponseDto,
  DashboardRecentOrdersResponseDto,
  SalesOverviewResponseDto,
} from './dto/dashboard-response.dto';

@Injectable({ scope: Scope.REQUEST }) // <-- 1. MAKE IT REQUEST-SCOPED
export class AdminHomeApiRepository implements IAdminHomeApiRepository {
  // This will hold the client once it's initialized for the request
  private prismaClient: PrismaClient | null = null;

  // 2. INJECT THE TENANT PRISMA SERVICE
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * 3. IMPLEMENT THE LAZY GETTER PATTERN
   * Initializes the Prisma client only when first needed within a request.
   */
  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  /**
   * Fetches the Key Performance Indicators (KPIs) for the dashboard.
   */
  // async getKpis(): Promise<DashboardKpisResponseDto> {
  //   const prisma = await this.getPrisma();

  //   const [
  //     totalRevenueResult,
  //     salesTodayResult,
  //     totalCustomers,
  //     activeProducts,
  //     inactiveProducts,
  //   ] = await Promise.all([
  //     prisma.order.aggregate({
  //       _sum: { totalAmount: true },
  //       where: { paymentStatus: 'PAID' },
  //     }),
  //     prisma.order.aggregate({
  //       _sum: { totalAmount: true },
  //       where: {
  //         paymentStatus: 'PAID',
  //         createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  //       },
  //     }),
  //     prisma.customer.count(),
  //     prisma.product.count({ where: { isActive: true } }),
  //     prisma.product.count({ where: { isActive: false } }),
  //   ]);

  //   return {
  //     totalRevenue: (
  //       totalRevenueResult._sum.totalAmount || new Decimal(0)
  //     ).toString(),
  //     salesToday: (
  //       salesTodayResult._sum.totalAmount || new Decimal(0)
  //     ).toString(),
  //     totalCustomers,
  //     activeProducts,
  //     inactiveProducts,
  //   };
  // }

  /**
   * Fetches the Key Performance Indicators (KPIs) for the dashboard.
   * Sequential approach - more reliable for unstable connections
   */
  async getKpis(): Promise<DashboardKpisResponseDto> {
    const prisma = await this.getPrisma();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Execute queries sequentially to avoid connection pool exhaustion

      // Total Revenue - Delivered and Paid orders
      const totalRevenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          paymentStatus: 'PAID',
        },
      });

      // Sales Today - Delivered and Paid orders from today
      const salesTodayResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          paymentStatus: 'PAID',
          createdAt: { gte: today },
        },
      });

      // Receivables - Delivered but not fully paid
      const receivablesResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          paymentStatus: {
            in: ['PENDING', 'PARTIALLY_PAID', 'PROCESSING'],
          },
        },
      });

      // Cash Collected - Sum of all successful payments
      const cashCollectedResult = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: {
            in: ['PAID', 'PARTIALLY_PAID'],
          },
        },
      });

      // Customer count
      const totalCustomers = await prisma.customer.count();

      // Active products
      const activeProducts = await prisma.product.count({
        where: { isActive: true },
      });

      // Inactive products
      const inactiveProducts = await prisma.product.count({
        where: { isActive: false },
      });

      return {
        totalRevenue: (
          totalRevenueResult._sum.totalAmount || new Decimal(0)
        ).toString(),
        salesToday: (
          salesTodayResult._sum.totalAmount || new Decimal(0)
        ).toString(),
        receivables: (
          receivablesResult._sum.totalAmount || new Decimal(0)
        ).toString(),
        cashCollected: (
          cashCollectedResult._sum.amount || new Decimal(0)
        ).toString(),
        totalCustomers,
        activeProducts,
        inactiveProducts,
      };
    } catch (error) {
      Logger.error('Error fetching KPIs', error);
      throw error;
    }
  }
  /**
   * Fetches the most recent orders for the dashboard.
   */
  async getRecentOrders(limit = 5): Promise<DashboardRecentOrdersResponseDto> {
    const prisma = await this.getPrisma();

    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Map to DTO to ensure consistency and convert Decimal to string
    const recentOrders = orders.map((order) => ({
      ...order,
      // Ensure all Decimal fields are converted to strings for the DTO
      totalAmount: order.totalAmount.toString(),
      subtotal: order.subtotal.toString(),
      taxAmount: order.taxAmount.toString(),
      shippingAmount: order.shippingAmount.toString(),
      items: [], // Assuming DTO doesn't need full items list for this view
    }));

    return { recentOrders };
  }

  async getSalesOverview(): Promise<SalesOverviewResponseDto> {
    const prisma = await this.getPrisma();

    // 1. Define the 12-month date range
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    twelveMonthsAgo.setHours(0, 0, 0, 0); // Normalize to the start of the day

    Logger.debug(
      `Fetching PENDING sales data from ${twelveMonthsAgo.toISOString()}`,
    );

    // 2. Initialize a map with all 12 months to guarantee they exist in the output
    const monthlyTotals = new Map<string, Decimal>();
    const monthOrder: string[] = []; // To ensure correct chronological sorting

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      // Pre-fill the map and the sorting array
      if (!monthlyTotals.has(monthName)) {
        monthlyTotals.set(monthName, new Decimal(0));
        monthOrder.push(monthName);
      }
    }

    // 3. Fetch all relevant orders from the database using a more efficient query
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: twelveMonthsAgo,
        },
        // NOTE: This is still filtering for only PENDING orders as per your last code.
        // Remove this line if you want to see totals for all statuses.
        paymentStatus: 'PENDING',
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    Logger.debug(`Found ${orders.length} PENDING orders to process.`);

    // 4. Populate the map with the actual sales data from the database
    orders.forEach((order) => {
      const monthName = order.createdAt.toLocaleDateString('en-US', {
        month: 'short',
      });

      // We know the month exists in the map because we pre-filled it
      const currentTotal = monthlyTotals.get(monthName)!;
      const orderAmount = order.totalAmount || new Decimal(0);
      monthlyTotals.set(monthName, currentTotal.plus(orderAmount));
    });

    // 5. Convert the map to the final array, using our sort order to guarantee chronology
    const sales = monthOrder.map((monthName) => ({
      name: monthName,
      total: monthlyTotals.get(monthName)!.toString(),
    }));

    return { sales };
  }
}
