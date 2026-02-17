import { Injectable, OnModuleInit } from '@nestjs/common';
import { PaymentProvider, PaymentStatus } from '@generated/prisma/client';
import {
  PaymentProviderInterface,
  PaymentInitializationResult,
  PaymentVerificationResult,
} from '../interfaces/payment-provider.interface';
import { PaymentProviderRegistry } from './payment-provider.registry';
import { InitializePaymentDto } from '../dto/initialize-payment.dto';

@Injectable()
export class StripeProvider implements PaymentProviderInterface, OnModuleInit {
  constructor(private readonly registry: PaymentProviderRegistry) {}

  onModuleInit() {
    this.registry.register(this);
  }

  getName(): PaymentProvider {
    return PaymentProvider.STRIPE;
  }

  async initialize(
    dto: InitializePaymentDto,
  ): Promise<PaymentInitializationResult> {
    // Logic for Stripe Checkout Session

    return {
      providerTransactionId: 'stripe_123',
      checkoutUrl: 'https://stripe.com/checkout-placeholder',
      metadata: {},
    };
  }

  async verify(): Promise<PaymentVerificationResult> {
    return {
      providerTransactionId: '...',
      status: PaymentStatus.PENDING,
    };
  }

  async handleWebhook(payload: any): Promise<PaymentVerificationResult> {
    // Logic to parse Stripe event type

    return {
      providerTransactionId: '...',
      status: PaymentStatus.PAID,
    };
  }
}
