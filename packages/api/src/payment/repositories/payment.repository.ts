import { Injectable } from '@nestjs/common';
import { Prisma, Payment, PaymentStatus } from '@generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
    // We use the base prisma because 'tenantId' is explicitly passed in data
    return this.prisma.payment.create({ data });
  }

  async findByProviderTransactionId(providerTransactionId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { providerTransactionId },
    });
  }

  async updateStatus(
    id: string, 
    tenantId: string, 
    status: PaymentStatus, 
    metadata: any
  ): Promise<Payment> {
    return this.prisma.client.payment.update({
      where: { id, tenantId },
      data: {
        status,
        // Enterprise Standard: Merge new metadata with existing instead of overwriting
        metadata: metadata ? metadata : undefined, 
        updatedAt: new Date(),
      },
    });
  }
}