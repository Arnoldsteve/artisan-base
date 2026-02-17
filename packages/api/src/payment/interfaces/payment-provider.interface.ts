import { PaymentStatus, PaymentProvider } from '@generated/prisma/client';
import { InitializePaymentDto } from '../dto/initialize-payment.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';

export interface PaymentInitializationResult {
  providerTransactionId: string;
  checkoutUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerificationResult {
  providerTransactionId: string;
  status: PaymentStatus; // Now using Prisma Enum
  rawPayload?: Record<string, any>;
}

export interface PaymentProviderInterface {
  getName(): PaymentProvider; // Helps the registry identify the provider
  initialize(dto: InitializePaymentDto): Promise<PaymentInitializationResult>;
  verify(dto: VerifyPaymentDto): Promise<PaymentVerificationResult>;
  handleWebhook(payload: Record<string, any>, signature?: string): Promise<PaymentVerificationResult>;
}