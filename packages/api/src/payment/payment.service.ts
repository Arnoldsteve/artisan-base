import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentStatus, PaymentProvider } from '@generated/prisma/client';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentProviderRegistry } from './providers/payment-provider.registry';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PaymentInitParams } from './interfaces/payment-provider.interface';

export interface InitiatePaymentParams {
  orderId?: string;           // Optional — could be a subscription payment too
  provider: PaymentProvider;
  amount: number;
  currency: string;
  phone?: string;             // Mpesa
  returnUrl?: string;         // Stripe
  description?: string;
  reference: string;          // Caller provides their own reference
  metadata?: Record<string, any>;
}

export interface PaymentUpdatedEvent {
  tenantId: string;
  paymentId: string;
  reference: string;          // Caller uses this to identify their entity
  status: PaymentStatus;
  rawPayload?: Record<string, any>;
}

/**
 * Pure Infrastructure Service.
 * Knows ONLY how to move money and emit raw facts.
 * No order logic. No subscription logic. No business rules.
 *
 * Callers (OrderService, BillingService) own their own context.
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly registry: PaymentProviderRegistry,
    private readonly tenantContext: TenantContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Initiates a payment via the appropriate provider.
   * Returns providerTransactionId + optional checkoutUrl/stkPushRequestId.
   */
  async initiate(params: InitiatePaymentParams) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const provider = this.registry.get(params.provider);

    const initParams: PaymentInitParams = {
      amount: params.amount,
      currency: params.currency,
      phone: params.phone,
      returnUrl: params.returnUrl,
      description: params.description,
      reference: params.reference,
      metadata: params.metadata,
    };

    // 1. Call provider (Mpesa STK / Stripe Checkout)
    const result = await provider.initialize(initParams);

    // 2. Idempotency — don't create duplicate records
    const existing = await this.paymentRepo.findByProviderTransactionId(
      result.providerTransactionId,
    );
    if (existing) return existing;

    // 3. Persist payment record
    const payment = await this.paymentRepo.create({
      tenantId,
      orderId: params.orderId,
      provider: params.provider,
      amount: params.amount,
      status: PaymentStatus.PENDING,
      providerTransactionId: result.providerTransactionId,
      metadata: {
        reference: params.reference,
        ...result.metadata,
      },
    });

    this.logger.log(
      `Payment initiated | Provider: ${params.provider} | Ref: ${params.reference} | ID: ${payment.id}`,
    );

    return {
      paymentId: payment.id,
      providerTransactionId: result.providerTransactionId,
      checkoutUrl: result.checkoutUrl,           // Stripe
      stkPushRequestId: result.stkPushRequestId, // Mpesa
    };
  }

  /**
   * Handles incoming webhook from any provider.
   * Parses, updates status, emits raw event — nothing more.
   */
  async handleWebhook(
    providerType: PaymentProvider,
    payload: Record<string, any>,
    signature?: string,
  ) {
    const provider = this.registry.get(providerType);

    // 1. Let the provider parse its own payload
    const result = await provider.handleWebhook(payload, signature);

    if (!result.providerTransactionId) {
      this.logger.warn(`Webhook ignored — no providerTransactionId extracted`);
      return { success: true };
    }

    // 2. Find the payment record
    const payment = await this.paymentRepo.findByProviderTransactionId(
      result.providerTransactionId,
    );

    if (!payment) {
      this.logger.warn(`Webhook: Payment not found for ${result.providerTransactionId}`);
      return { success: true }; // Always 200 to provider
    }

    // 3. Skip if status unchanged (idempotency)
    if (payment.status === result.status) {
      this.logger.debug(`Webhook: Payment ${payment.id} already at status ${result.status}`);
      return { success: true };
    }

    // 4. Update status
    await this.paymentRepo.updateStatus(
      payment.id,
      payment.tenantId,
      result.status,
      result.rawPayload,
    );

    // 5. Emit raw fact — callers decide what to do
    const event: PaymentUpdatedEvent = {
      tenantId: payment.tenantId,
      paymentId: payment.id,
      reference: (payment.metadata as any)?.reference ?? '',
      status: result.status,
      rawPayload: result.rawPayload,
    };

    this.eventEmitter.emit('payment.updated', event);

    this.logger.log(
      `Payment ${payment.id} → ${result.status} | Ref: ${event.reference}`,
    );

    return { success: true };
  }

  /**
   * Manual verify — useful for polling (e.g. Mpesa STK query)
   */
  async verify(paymentId: string) {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) throw new NotFoundException(`Payment ${paymentId} not found`);

    const provider = this.registry.get(payment.provider);
    const result = await provider.verify(payment.providerTransactionId);

    if (payment.status !== result.status) {
      await this.paymentRepo.updateStatus(
        payment.id,
        payment.tenantId,
        result.status,
        result.rawPayload,
      );

      this.eventEmitter.emit('payment.updated', {
        tenantId: payment.tenantId,
        paymentId: payment.id,
        reference: (payment.metadata as any)?.reference ?? '',
        status: result.status,
      } as PaymentUpdatedEvent);
    }

    return { paymentId: payment.id, status: result.status };
  }
}