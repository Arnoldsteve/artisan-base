import { Injectable } from '@nestjs/common';
import { Prisma, Payment, PaymentStatus } from '@generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
    // Base prisma — tenantId is explicitly passed in data
    return this.prisma.payment.create({ data });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async findByProviderTransactionId(
    providerTransactionId: string,
  ): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { providerTransactionId },
    });
  }

  async updateStatus(
    id: string,
    tenantId: string,
    status: PaymentStatus,
    rawPayload?: Record<string, any>,
  ): Promise<Payment> {
    // Fetch existing metadata and merge — never overwrite
    const existing = await this.prisma.payment.findUnique({
      where: { id },
      select: { metadata: true },
    });

    const mergedMetadata = {
      ...(existing?.metadata as Record<string, any> ?? {}),
      ...(rawPayload ? { lastWebhookPayload: rawPayload } : {}),
    };

    return this.prisma.client.payment.update({
      where: { id, tenantId },
      data: {
        status,
        metadata: mergedMetadata,
      },
    });
  }
}