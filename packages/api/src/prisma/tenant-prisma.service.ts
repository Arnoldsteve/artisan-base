import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestWithTenant } from '../common/interfaces/request-with-tenant.interface';
import { TenantClientFactory } from './tenant-client-factory.service';
import { PrismaClient } from '../../generated/tenant';

// This service is still request-scoped because it needs the specific tenant from each request.
@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService {
  newsletterSubscription: any;
  private readonly tenantSchema: string;

  // We inject the GLOBAL factory and the current REQUEST
  constructor(
    private readonly factory: TenantClientFactory,
    @Inject(REQUEST) private readonly request: RequestWithTenant,
  ) {
    const tenant = this.request.tenant;
    if (!tenant || !tenant.dbSchema) {
      throw new Error('Tenant information or dbSchema is not available on the request.');
    }
    this.tenantSchema = tenant.dbSchema;
  }

  /**
   * This is the new primary method. It uses the factory to get the
   * right Prisma Client for the current request's tenant.
   * @returns A promise that resolves to the tenant-specific PrismaClient.
   */
  async getClient(): Promise<PrismaClient> {
    return this.factory.getClient(this.tenantSchema);
  }
}