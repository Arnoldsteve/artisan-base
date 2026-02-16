import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Tenant } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * This repository is the ONLY place that handles direct database 
 * operations for the Tenant model.
 */
@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new tenant. 
   * This is used during the first step of onboarding.
   */
  async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
    return this.prisma.tenant.create({
      data,
    });
  }

  /**
   * Finds a tenant by its unique subdomain.
   * Essential for global scale to ensure no two stores have the same URL.
   */
  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { subdomain },
    });
  }

  /**
   * Finds a tenant by its ID.
   */
  async findById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  /**
   * Updates tenant settings (like currency or timezone).
   * Important for African/Global localization after onboarding.
   */
  async update(id: string, data: Prisma.TenantUpdateInput): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  /**
   * Checks if a subdomain is already taken.
   * Prevents collisions before we even try to create the record.
   */
  async existsBySubdomain(subdomain: string): Promise<boolean> {
    const count = await this.prisma.tenant.count({
      where: { subdomain },
    });
    return count > 0;
  }
}