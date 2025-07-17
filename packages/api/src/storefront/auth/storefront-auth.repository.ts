// src/storefront/auth/storefront-auth.repository.ts
import { Injectable, Inject, Scope } from '@nestjs/common';
import { TenantClientFactory } from 'src/prisma/tenant-client-factory.service';
import { IStorefrontAuthRepository } from './interfaces/storefront-auth-repository.interface';
import { REQUEST } from '@nestjs/core';
import { RequestWithTenant } from 'src/common/interfaces/request-with-tenant.interface';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontAuthRepository implements IStorefrontAuthRepository {
  constructor(
    @Inject(REQUEST) private readonly request: RequestWithTenant,
    private readonly tenantClientFactory: TenantClientFactory,
  ) {}

  private getPrismaClient() {
    const tenant = this.request.tenant;
    if (!tenant) {
      throw new Error('Tenant information is not available on the request.');
    }
    return this.tenantClientFactory.getTenantClient(tenant.dbSchema);
  }

  async findCustomerByEmail(email: string) {
    const prisma = this.getPrismaClient();
    return prisma.customer.findUnique({ where: { email } });
  }

  async createCustomer(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const prisma = this.getPrismaClient();
    return prisma.customer.create({ data });
  }

  async updateCustomerPassword(email: string, hashedPassword: string) {
    const prisma = this.getPrismaClient();
    return prisma.customer.update({
      where: { email },
      data: { hashedPassword },
    });
  }

  async updateCustomerDetails(
    email: string,
    data: Partial<{ firstName: string; lastName: string; phone: string }>,
  ) {
    const prisma = this.getPrismaClient();
    return prisma.customer.update({ where: { email }, data });
  }
}