import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { IStorefrontAuthRepository } from './interfaces/storefront-auth-repository.interface';

@Injectable()
export class StorefrontAuthRepository implements IStorefrontAuthRepository {
  constructor(private readonly prisma: TenantPrismaService) {}

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
