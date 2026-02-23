import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Tenant } from '@generated/prisma/client';

@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Global: Registration flow.
   */
  async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
    return this.prisma.tenant.create({ data });
  }

  /**
   * Global: Availability check across the whole platform.
   */
  async existsBySubdomain(subdomain: string): Promise<boolean> {
    const count = await this.prisma.tenant.count({
      where: { subdomain },
    });
    return count > 0;
  }

  /**
   * Isolated: Fetch store profile safely.
   */
  async findById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  /**
   * Isolated: Update store settings.
   */
  async update(id: string, data: Prisma.TenantUpdateInput): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  /**
   * GLOBAL ACTION: Find a tenant by its subdomain/slug.
   * This is used by the storefront to resolve 'artisanbase.com/shop/slug'
   * into a real tenantId for data isolation.
   */

  async findBySubdomain(subdomain: string) {
    return this.prisma.tenant.findUnique({
      where: { subdomain },
      select: {
        id: true,
        name: true,
        subdomain: true,
        baseCurrency: true,
        settings: true,
        status: true,
      },
    });
  }
}
