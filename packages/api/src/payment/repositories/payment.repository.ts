import { Injectable } from '@nestjs/common';
import { Prisma, Payment, PaymentStatus } from '@generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async findByProviderTransactionId(providerTransactionId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { providerTransactionId },
    });
  }

  /**
   * TOP 1% LOGIC: Find by Internal Reference
   * millions of users: Used to bridge the internal 'PAY-' ref to the Gateway ID.
   */
  async findByReference(reference: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: {
        metadata: {
          path: ['reference'],
          equals: reference,
        },
      },
    });
  }

  /**
   * TOP 1% LOGIC: Update Gateway ID
   * Replaces the temporary 'PAY-' ID with the actual Safaricom 'ws_CO' ID.
   */
  async updateProviderId(id: string, newProviderId: string, extraMetadata: any): Promise<Payment> {
    const existing = await this.findById(id);
    const mergedMetadata = {
      ...(existing?.metadata as any || {}),
      ...extraMetadata,
    };

    return this.prisma.payment.update({
      where: { id },
      data: {
        providerTransactionId: newProviderId,
        metadata: mergedMetadata,
      },
    });
  }

  async updateStatus(
    id: string,
    tenantId: string,
    status: PaymentStatus,
    rawPayload?: Record<string, any>,
  ): Promise<Payment> {
    const existing = await this.prisma.payment.findUnique({
      where: { id },
      select: { metadata: true },
    });

    // CRITICAL: Deep merge to ensure orderIds are NEVER lost
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