import { Injectable } from '@nestjs/common';
import { PaymentProviderInterface } from '../interfaces/payment-provider.interface';
import { InitializePaymentDto } from '../dto/initialize-payment.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
import { 
  PaymentInitializationResult,
  PaymentVerificationResult,
  PaymentWebhookResult,
} from '../interfaces/payment-provider.interface';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class MpesaProvider implements PaymentProviderInterface {

  async initialize(
    dto: InitializePaymentDto,
  ): Promise<PaymentInitializationResult> {
    // TODO: Implement STK Push logic

    return {
      providerTransactionId: 'mpesa_tx_placeholder',
      metadata: {},
    };
  }

  async verify(
    dto: VerifyPaymentDto,
  ): Promise<PaymentVerificationResult> {
    // TODO: Call Mpesa verification API

    return {
      providerTransactionId: dto.providerTransactionId,
      status: PaymentStatus.PENDING,
      rawResponse: {},
    };
  }

  async handleWebhook(
    payload: Record<string, any>,
    signature?: string,
  ): Promise<PaymentWebhookResult> {
    // TODO: Validate signature & parse callback

    return {
      providerTransactionId: 'mpesa_webhook_placeholder',
      status: PaymentStatus.SUCCESS,
      rawPayload: payload,
    };
  }
}
