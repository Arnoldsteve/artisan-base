import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentProvider } from './enums/payment-provider.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentProviderInterface } from './interfaces/payment-provider.interface';
import { MpesaProvider } from './providers/mpesa.provider';
import { StripeProvider } from './providers/stripe.provider';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly tenantContext: TenantContextService,
    private readonly mpesaProvider: MpesaProvider,
    private readonly stripeProvider: StripeProvider,
  ) {}

  /*
   ---------------------------------------------------------
   Provider Resolver (Open/Closed Principle)
   ---------------------------------------------------------
  */
  private resolveProvider(provider: PaymentProvider): PaymentProviderInterface {
    switch (provider) {
      case PaymentProvider.MPESA:
        return this.mpesaProvider;

      case PaymentProvider.STRIPE:
        return this.stripeProvider;

      default:
        throw new BadRequestException('Unsupported payment provider');
    }
  }

  /*
   ---------------------------------------------------------
   Initialize Payment
   ---------------------------------------------------------
  */
  async initialize(dto: InitializePaymentDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    const provider = this.resolveProvider(dto.provider);

    const providerResult = await provider.initialize(dto);

    const payment = await this.paymentRepo.create({
      id: randomUUID(),
      tenantId,
      orderId: dto.orderId,
      provider: dto.provider,
      method: dto.method,
      status: PaymentStatus.PENDING,
      providerTransactionId: providerResult.providerTransactionId,
      metadata: providerResult.metadata ?? {},
    });

    return {
      paymentId: payment.id,
      checkoutUrl: providerResult.checkoutUrl,
      status: payment.status,
    };
  }

  /*
   ---------------------------------------------------------
   Verify Payment
   ---------------------------------------------------------
  */
  async verify(dto: VerifyPaymentDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    const payment = await this.paymentRepo.findById(dto.paymentId, tenantId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const provider = this.resolveProvider(payment.provider);

    const verificationResult = await provider.verify(dto);

    await this.paymentRepo.updateStatus(
      payment.id,
      tenantId,
      verificationResult.status,
      verificationResult.rawResponse,
    );

    return {
      paymentId: payment.id,
      status: verificationResult.status,
    };
  }

  /*
   ---------------------------------------------------------
   Handle Webhook
   ---------------------------------------------------------
  */
  async handleWebhook(
    providerType: PaymentProvider,
    payload: Record<string, any>,
    signature?: string,
  ) {
    const provider = this.resolveProvider(providerType);

    const result = await provider.handleWebhook(payload, signature);

    const payment = await this.paymentRepo.findByProviderTransactionId(
      result.providerTransactionId,
    );

    if (!payment) {
      throw new NotFoundException('Payment not found for webhook');
    }

    await this.paymentRepo.updateStatus(
      payment.id,
      payment.tenantId,
      result.status,
      result.rawPayload,
    );

    return { received: true };
  }

  /*
   ---------------------------------------------------------
   Get Payment
   ---------------------------------------------------------
  */
  async findById(id: string) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    const payment = await this.paymentRepo.findById(id, tenantId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  /*
   ---------------------------------------------------------
   Get Payments by Order
   ---------------------------------------------------------
  */
  async findByOrder(orderId: string) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    return this.paymentRepo.findByOrderId(orderId, tenantId);
  }
}
