import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, TenantMember, TenantUserRole } from '@generated/prisma/client';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

@Injectable()
export class TenantMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Global: Used during onboarding.
   */
  async create(
    data: Prisma.TenantMemberUncheckedCreateInput,
  ): Promise<TenantMember> {
    return this.prisma.client.tenantMember.create({ data });
  }

  /**
   * Isolated: Finds membership within current tenant context.
   */
  async findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<TenantMember | null> {
    return this.prisma.tenantMember.findUnique({
      where: {
        tenantId_userId: { tenantId, userId },
      },
    });
  }

  /**
   * Isolated: Lists members with pagination.
   */
  async listByTenant1(skip?: number, take?: number) {
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

  async listByTenant(options: PageOptionsDto) {
    const where: Prisma.TenantMemberWhereInput = {
      ...(options.search && {
        OR: [
          {
            user: {
              firstName: {
                contains: options.search,
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              lastName: {
                contains: options.search,
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              email: {
                contains: options.search,
                mode: 'insensitive',
              },
            },
          },
        ],
      }),
    };

    return this.prisma.client.tenantMember.paginate({
      options,
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      cache: true,
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
    return this.prisma.tenantMember.findMany({
      where: { userId, isActive: true },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            status: true,
            baseCurrency: true,
            timezone: true,
          },
        },
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
