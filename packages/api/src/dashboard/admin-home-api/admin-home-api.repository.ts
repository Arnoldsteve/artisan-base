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
  async getKpis(): Promise<DashboardKpisResponseDto> {
    const prisma = await this.getPrisma();

    const [
      totalRevenueResult,
      salesTodayResult,
      totalCustomers,
      activeProducts,
      inactiveProducts,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.customer.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
    ]);

    return {
      totalRevenue: (
        totalRevenueResult._sum.totalAmount || new Decimal(0)
      ).toString(),
      salesToday: (
        salesTodayResult._sum.totalAmount || new Decimal(0)
      ).toString(),
      totalCustomers,
      activeProducts,
      inactiveProducts,
    };
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
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Use Prisma's aggregation instead of raw SQL
    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        paymentStatus: 'PAID',
      },
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Process the data to group by month
    const monthlyTotals = new Map<string, Decimal>();

    salesData.forEach((item) => {
      const month = item.createdAt.toLocaleDateString('en-US', {
        month: 'short',
      });
      const current = monthlyTotals.get(month) || new Decimal(0);
      monthlyTotals.set(month, current.plus(item._sum.totalAmount || 0));
    });

    const sales = Array.from(monthlyTotals.entries()).map(([month, total]) => ({
      name: month,
      total: total.toString(),
    }));

    return { sales };
  }
}
