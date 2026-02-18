import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Customer, Prisma } from '@generated/prisma/client';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';

@Injectable()
export class CustomerRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  /**
   * Creates a customer.
   * Uses this.prisma.client to ensure row-level isolation logic is applied.
   */
  async create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer> {
    return this.prisma.client.customer.create({
      data,
    });
  }

  /**
   * Finds a unique customer by email within the tenant context.
   * Since email is only unique per tenant, we use the compound index.
   */
  async findByEmail(email: string): Promise<Customer | null> {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    return this.prisma.client.customer.findUnique({
      where: {
        // This matches the @@unique([tenantId, email]) in your schema
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });
  }

  /**
   * Finds a customer by ID.
   */
  async findById(id: string): Promise<Customer | null> {
    return this.prisma.client.customer.findUnique({
      where: { id },
    });
  }

  /**
   * Paginated list of customers for this tenant.
   */

  async list(params: { skip?: number; take?: number; where?: Prisma.CustomerWhereInput }) {
    return this.prisma.client.customer.findMany({
      ...params,
      orderBy: { createdAt: 'desc' },
    });
  }


  async count(where?: Prisma.CustomerWhereInput): Promise<number> {
    return this.prisma.client.customer.count({where});
  }

  async update(
    id: string,
    data: Prisma.CustomerUpdateInput,
  ): Promise<Customer> {
    return this.prisma.client.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Customer> {
    return this.prisma.client.customer.delete({
      where: { id },
    });
  }
}
