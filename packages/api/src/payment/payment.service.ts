import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentStatus, PaymentProvider } from '@generated/prisma/client';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentProviderRegistry } from './providers/payment-provider.registry';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly registry: PaymentProviderRegistry,
    private readonly tenantContext: TenantContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initialize(dto: InitializePaymentDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const providerStrategy = this.registry.get(dto.provider);

    // 1. Get transaction info from external provider (Stripe/Mpesa)
    const result = await providerStrategy.initialize(dto);

    // 2. Idempotency Check (Essential for African mobile money networks)
    const existing = await this.paymentRepo.findByProviderTransactionId(result.providerTransactionId);
    if (existing) return existing;

    // 3. Persist via Repository
    return this.paymentRepo.create({
      tenantId,
      orderId: dto.orderId,
      provider: dto.provider,
      amount: dto.amount,
      // currency: dto.currency,
      status: PaymentStatus.PENDING,
      providerTransactionId: result.providerTransactionId,
      metadata: result.metadata ?? {},
    });
  }

  async handleWebhook(providerType: PaymentProvider, payload: any, signature?: string) {
    const strategy = this.registry.get(providerType);
    
    // 1. Strategy parses the specific provider's payload
    const result = await strategy.handleWebhook(payload, signature);

    // 2. Locate the record via Repo
    const payment = await this.paymentRepo.findByProviderTransactionId(result.providerTransactionId);
    if (!payment) throw new NotFoundException(`Payment ${result.providerTransactionId} not found`);

    // 3. Update status if changed
    if (payment.status !== result.status) {
      const updatedPayment = await this.paymentRepo.updateStatus(
        payment.id, 
        payment.tenantId, 
        result.status, 
        result.rawPayload
      );

      // 4. Emit Event: This notifies the OrderModule to mark order as PAID/SHIPPED
      // This decouples Payment from Order (SOLID)
      this.eventEmitter.emit('payment.updated', {
        tenantId: payment.tenantId,
        orderId: payment.orderId,
        paymentId: payment.id,
        status: result.status,
      });

      this.logger.log(`Payment ${payment.id} updated to ${result.status}`);
    }

    return { success: true };
  }
}