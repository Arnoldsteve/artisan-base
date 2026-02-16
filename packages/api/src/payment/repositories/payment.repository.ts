import { Injectable } from '@nestjs/common';
import { Prisma, Payment } from '@generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.PaymentUncheckedCreateInput,
  ): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    });
  }

  async findById(
    id: string,
    tenantId: string,
  ): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: {
        id,
        tenantId,
      },
    });
  }

  async findByOrderId(
    orderId: string,
    tenantId: string,
  ): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: {
        orderId,
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByProviderTransactionId(
    providerTransactionId: string,
  ): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: {
        providerTransactionId,
      },
    });
  }

  async updateStatus(
    id: string,
    tenantId: string,
    status: PaymentStatus,
    metadata?: Prisma.InputJsonValue,
  ): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status,
        metadata,
      },
    });
  }
}
