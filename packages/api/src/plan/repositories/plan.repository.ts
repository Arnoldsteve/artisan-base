import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@generated/prisma/client';

@Injectable()
export class PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SubscriptionPlanCreateInput) {
    return this.prisma.subscriptionPlan.create({ data });
  }

  async findAll() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.SubscriptionPlanUpdateInput) {
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async countTenants(planId: string): Promise<number> {
    return this.prisma.tenant.count({
      where: { planId },
    });
  }
}