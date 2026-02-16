import { InitializePaymentDto } from '../dto/initialize-payment.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface PaymentInitializationResult {
  providerTransactionId: string;
  checkoutUrl?: string;      // e.g., Stripe hosted page
  metadata?: Record<string, any>;
}

export interface PaymentVerificationResult {
  providerTransactionId: string;
  status: PaymentStatus;
  rawResponse?: Record<string, any>;
}

export interface PaymentWebhookResult {
  providerTransactionId: string;
  status: PaymentStatus;
  rawPayload?: Record<string, any>;
}

export interface PaymentProviderInterface {
  /**
   * Initialize a payment with the external provider
   */
  initialize(
    dto: InitializePaymentDto,
  ): Promise<PaymentInitializationResult>;

  /**
   * Verify payment status with provider
   */
  verify(
    dto: VerifyPaymentDto,
  ): Promise<PaymentVerificationResult>;

  /**
   * Handle webhook payload from provider
   */
  handleWebhook(
    payload: Record<string, any>,
    signature?: string,
  ): Promise<PaymentWebhookResult>;
}
