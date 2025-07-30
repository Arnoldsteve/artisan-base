import { Injectable, Scope, OnModuleInit } from '@nestjs/common';
import { IStorefrontAuthRepository } from './interfaces/storefront-auth-repository.interface';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { PrismaClient } from '../../../generated/tenant'; // Import the actual PrismaClient type

@Injectable({ scope: Scope.REQUEST })
export class StorefrontAuthRepository
  implements IStorefrontAuthRepository, OnModuleInit // Implement OnModuleInit
{
  // This property will hold the ready-to-use client for this request.
  private prisma: PrismaClient;

  // Inject the TenantPrismaService, which is the standard gateway for all repositories.
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * This hook runs once per request, fetching the correct Prisma client for the
   * tenant and assigning it to the local `this.prisma` property.
   */
  async onModuleInit() {
    this.prisma = await this.tenantPrismaService.getClient();
  }

  // All methods below now correctly use the initialized `this.prisma`.

  async findCustomerByEmail(email: string) {
    return this.prisma.customer.findUnique({ where: { email } });
  }

  async createCustomer(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.prisma.customer.create({ data });
  }

  async updateCustomerPassword(email: string, hashedPassword: string) {
    return this.prisma.customer.update({
      where: { email },
      data: { hashedPassword },
    });
  }

  async updateCustomerDetails(
    email: string,
    data: Partial<{ firstName: string; lastName: string; phone: string }>,
  ) {
    return this.prisma.customer.update({ where: { email }, data });
  }
}