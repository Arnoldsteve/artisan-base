import { Injectable, OnModuleInit } from '@nestjs/common';
import { PaymentProvider, PaymentStatus } from '@generated/prisma/client';
import { PaymentProviderInterface, PaymentInitializationResult, PaymentVerificationResult } from '../interfaces/payment-provider.interface';
import { PaymentProviderRegistry } from './payment-provider.registry';
import { InitializePaymentDto } from '../dto/initialize-payment.dto';

@Injectable()
export class MpesaProvider implements PaymentProviderInterface, OnModuleInit {
  constructor(private readonly registry: PaymentProviderRegistry) {}

  onModuleInit() {
    this.registry.register(this);
  }

  getName(): PaymentProvider {
    return PaymentProvider.MPESA;
  }

  async initialize(dto: InitializePaymentDto): Promise<PaymentInitializationResult> {
    // Logic for Mpesa STK Push
    return { providerTransactionId: 'mpesa_123', metadata: { phone: '254...' } };
  }

  async verify(): Promise<PaymentVerificationResult> {
    return { providerTransactionId: '...', status: PaymentStatus.PENDING };
  }

  async handleWebhook(payload: any): Promise<PaymentVerificationResult> {
    // Logic to parse Mpesa ResultCode
    return { providerTransactionId: '...', status: PaymentStatus.PAID };
  }
}