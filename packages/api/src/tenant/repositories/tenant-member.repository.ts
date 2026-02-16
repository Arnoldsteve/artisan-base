import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, TenantMember, TenantUserRole } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * This repository manages memberships. It uses the extended 'client'
 * to ensure all queries are automatically scoped to the current tenant.
 */
@Injectable()
export class TenantMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Links a user to a tenant.
   * Note: During onboarding, use the base 'this.prisma' if no context exists.
   * For general app use, 'this.prisma.client' is preferred.
   */
  async create(data: Prisma.TenantMemberUncheckedCreateInput): Promise<TenantMember> {
    return this.prisma.tenantMember.create({
      data,
    });
  }

  /**
   * Finds a specific membership for the current tenant context.
   */
  async findByTenantAndUser(tenantId: string, userId: string): Promise<TenantMember | null> {
    return this.prisma.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });
  }

  /**
   * Updates a member's role.
   */
  async updateRole(id: string, role: TenantUserRole): Promise<TenantMember> {
    return this.prisma.tenantMember.update({
      where: { id },
      data: { role },
    });
  }

  /**
   * Deactivates a member.
   */
  async setStatus(id: string, isActive: boolean): Promise<TenantMember> {
    return this.prisma.tenantMember.update({
      where: { id },
      data: { isActive },
    });
  }

   /**
   * Lists all stores (tenants) a specific user belongs to.
   * NOTE: We use 'this.prisma' (Base Client) because this is a Global 
   * search that crosses tenant boundaries.
   */
  async listByUser(userId: string) {
    return this.prisma.tenantMember.findMany({
      where: { 
        userId, 
        isActive: true 
      },
      include: { 
        tenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            status: true
          }
        } 
      },
    });
  }
  
  /**
   * Lists all members of the current tenant.
   * 'this.prisma.client' automatically adds the 'where: { tenantId }' filter.
   */
  async listByTenant(): Promise<TenantMember[]> {
    return this.prisma.tenantMember.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}