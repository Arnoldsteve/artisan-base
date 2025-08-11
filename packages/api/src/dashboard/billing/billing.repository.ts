import { Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from '../../prisma/tenant-prisma.service';
import { IBillingRepository } from './interfaces/billing-repository.interface';
import { PrismaClient } from '../../../generated/tenant';

@Injectable({ scope: Scope.REQUEST })
export class BillingRepository implements IBillingRepository {
  // This will hold the client once it's initialized for the request
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * Lazy getter that initializes the Prisma client only when first needed
   * and reuses it for subsequent calls within the same request.
   */
  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  // As discussed, this class is a placeholder to fit the architecture.
  // Tenant-specific billing DB methods would go here in the future.
}