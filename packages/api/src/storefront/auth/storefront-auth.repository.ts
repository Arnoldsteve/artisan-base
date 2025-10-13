import { Injectable, Scope } from '@nestjs/common';
import { IStorefrontAuthRepository } from './interfaces/storefront-auth-repository.interface';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { PrismaClient } from '../../../generated/tenant';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontAuthRepository implements IStorefrontAuthRepository {
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

  async findCustomerByEmail(email: string) {
    const prisma = await this.getPrisma();
    return prisma.customer.findUnique({ where: { email } });
  }

  async findCustomerById(id: string) {
    const prisma = await this.getPrisma();
    return prisma.customer.findUnique({ where: { id } });
  }

  async createCustomer(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const prisma = await this.getPrisma();
    return prisma.customer.create({ data });
  }

  async updateCustomerPassword(email: string, hashedPassword: string) {
    const prisma = await this.getPrisma();
    return prisma.customer.update({
      where: { email },
      data: { hashedPassword },
    });
  }

  async updateCustomerDetails(
    email: string,
    data: Partial<{ firstName: string; lastName: string; phone: string }>,
  ) {
    const prisma = await this.getPrisma();
    return prisma.customer.update({ where: { email }, data });
  }
}
