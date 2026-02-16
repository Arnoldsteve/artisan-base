import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, TenantMember, TenantUserRole } from '@generated/prisma/client';

@Injectable()
export class TenantMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Global: Used during onboarding.
   */
  async create(data: Prisma.TenantMemberUncheckedCreateInput): Promise<TenantMember> {
    return this.prisma.client.tenantMember.create({ data });
  }

  /**
   * Isolated: Finds membership within current tenant context.
   */
  async findByTenantAndUser(tenantId: string, userId: string): Promise<TenantMember | null> {
    return this.prisma.client.tenantMember.findUnique({
      where: {
        tenantId_userId: { tenantId, userId },
      },
    });
  }

  /**
   * Isolated: Lists members with pagination.
   */
  async listByTenant(skip?: number, take?: number) {
    return this.prisma.client.tenantMember.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Isolated: Counts members for pagination metadata.
   */
  async countByTenant(): Promise<number> {
    return this.prisma.client.tenantMember.count();
  }

  /**
   * Global: Lists all stores a user belongs to (Cross-tenant).
   */
  async listByUser(userId: string) {
    return this.prisma.client.tenantMember.findMany({
      where: { userId, isActive: true },
      include: { 
        tenant: {
          select: { id: true, name: true, subdomain: true, status: true }
        } 
      },
    });
  }

  async updateRole(id: string, role: TenantUserRole): Promise<TenantMember> {
    return this.prisma.client.tenantMember.update({
      where: { id },
      data: { role },
    });
  }
}