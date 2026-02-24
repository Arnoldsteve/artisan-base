import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentStatus, PaymentProvider, PaymentType } from '@generated/prisma/client';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentProviderRegistry } from './providers/payment-provider.registry';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PaymentInitParams } from './interfaces/payment-provider.interface';

export interface InitiatePaymentParams {
  orderId?: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  phone?: string;
  returnUrl?: string;
  description?: string;
  reference: string; // Internal 'PAY-...' reference
  metadata?: Record<string, any>;
}

export interface PaymentUpdatedEvent {
  tenantId: string;
  paymentId: string;
  reference: string;
  status: PaymentStatus;
  rawPayload?: Record<string, any>;
}

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
   * millions of users: Orchestrates the transition from Internal Ref to Gateway ID.
   * This prevents duplicate rows and ensures metadata (orderIds) is preserved.
   */
  async initiate(params: InitiatePaymentParams) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const provider = this.registry.get(params.provider);

    // 1. TOP 1% LOGIC: Resolve existing record created by OrderService
    const existingPayment = await this.paymentRepo.findByReference(params.reference);

    // 2. Call External Gateway (Mpesa STK / Stripe Checkout)
    const result = await provider.initialize({
      amount: params.amount,
      currency: params.currency,
      phone: params.phone,
      returnUrl: params.returnUrl,
      description: params.description,
      reference: params.reference,
      metadata: params.metadata,
    });

    if (existingPayment) {
      /**
       * 3. HANDSHAKE: Update existing record with the real Gateway ID
       * Replaces the 'PAY-...' internal ref with Safaricom's 'ws_CO...' ID.
       */
      const updated = await this.paymentRepo.updateProviderId(
        existingPayment.id,
        result.providerTransactionId,
        result.metadata
      );
      
      this.logger.log(`Handshake complete | Ref: ${params.reference} -> GatewayID: ${result.providerTransactionId}`);
      
      return {
        paymentId: updated.id,
        providerTransactionId: updated.providerTransactionId,
        checkoutUrl: result.checkoutUrl,
        stkPushRequestId: result.stkPushRequestId,
      };
    }

    /**
     * 4. FALLBACK: Create new record if none existed (e.g., Subscription payment)
     */
    const payment = await this.paymentRepo.create({
      tenantId,
      type: params.metadata?.type === 'SUBSCRIPTION' ? 'SUBSCRIPTION' : 'ORDER',
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

    return {
      paymentId: payment.id,
      providerTransactionId: result.providerTransactionId,
      checkoutUrl: result.checkoutUrl,
      stkPushRequestId: result.stkPushRequestId,
    };
  }

  async handleWebhook(providerType: PaymentProvider, payload: Record<string, any>, signature?: string) {
    const provider = this.registry.get(providerType);
    const result = await provider.handleWebhook(payload, signature);

    if (!result.providerTransactionId) return { success: true };

    const payment = await this.paymentRepo.findByProviderTransactionId(result.providerTransactionId);

    if (!payment) {
      this.logger.warn(`Webhook: Payment not found for Gateway ID: ${result.providerTransactionId}`);
      return { success: true };
    }

    if (payment.status === result.status) return { success: true };

    // 5. UPDATE: Repository handles the deep-merge of metadata
    await this.paymentRepo.updateStatus(
      payment.id,
      payment.tenantId,
      result.status,
      result.rawPayload,
    );

    const event: PaymentUpdatedEvent = {
      tenantId: payment.tenantId,
      paymentId: payment.id,
      reference: (payment.metadata as any)?.reference ?? '',
      status: result.status,
      rawPayload: result.rawPayload,
    };

    this.eventEmitter.emit('payment.updated', event);
    this.logger.log(`Payment ${payment.id} [Ref: ${event.reference}] status updated to ${result.status}`);

    return { success: true };
  }

  async verify(paymentId: string) {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) throw new NotFoundException(`Payment not found`);

    const provider = this.registry.get(payment.provider);
    const result = await provider.verify(payment.providerTransactionId);

    if (payment.status !== result.status) {
      await this.paymentRepo.updateStatus(payment.id, payment.tenantId, result.status, result.rawPayload);

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