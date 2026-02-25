import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, PaymentStatus } from '@generated/prisma/client';
import { firstValueFrom } from 'rxjs';
import {
  IPaymentProvider,
  PaymentInitParams,
  PaymentInitResult,
  PaymentVerifyResult,
  PaymentFulfillmentType, // 1. Import the new type
} from '../interfaces/payment-provider.interface';
import { PaymentProviderRegistry } from './payment-provider.registry';

@Injectable()
export class PaypalProvider implements IPaymentProvider, OnModuleInit {
  private readonly logger = new Logger(PaypalProvider.name);

  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly registry: PaymentProviderRegistry,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('PAYPAL_BASE_URL');
    this.clientId = this.config.get<string>('PAYPAL_CLIENT_ID');
    this.clientSecret = this.config.get<string>('PAYPAL_CLIENT_SECRET');
  }

  onModuleInit() {
    this.registry.register(this);
  }

  getName(): PaymentProvider {
    return PaymentProvider.PAYPAL;
  }

  /**
   * ✅ NEW: Implement Fulfillment Type
   * millions of users: We return REDIRECT to signal that the user 
   * MUST be sent to an external site to authorize payment.
   */
  getFulfillmentType(): PaymentFulfillmentType {
    return PaymentFulfillmentType.REDIRECT;
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const { data } = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    return data.access_token;
  }

  // ─── IPaymentProvider Implementation ────────────────────────────────────────

  /**
   * Initializes a PayPal Order.
   */
   async initialize(params: PaymentInitParams): Promise<PaymentInitResult> {
    const token = await this.getAccessToken();

    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    const currencyCode = supportedCurrencies.includes(params.currency) 
      ? params.currency 
      : 'USD'; 

    const amount = currencyCode === 'USD' && params.currency === 'KES' 
      ? (params.amount / 129) 
      : params.amount;

    const { data } = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: params.reference,
              amount: {
                currency_code: currencyCode,
                value: amount.toFixed(2),
              },
              description: params.description,
            },
          ],
          application_context: {
            // Updated to use the returnUrl from params for flexibility
            return_url: params.returnUrl || 'http://localhost:3000/checkout/confirmation',
            cancel_url: 'http://localhost:3000/checkout',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const approveLink = data.links.find((l) => l.rel === 'approve');

    return {
      providerTransactionId: data.id,
      checkoutUrl: approveLink?.href,
      metadata: {
        paypalOrderId: data.id,
        originalCurrency: params.currency,
        convertedCurrency: currencyCode,
      },
    };
  }
  
  /**
   * Verify the status of a PayPal order
   */
  async verify(providerTransactionId: string): Promise<PaymentVerifyResult> {
    const token = await this.getAccessToken();

    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/v2/checkout/orders/${providerTransactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );

    const statusMap: Record<string, PaymentStatus> = {
      COMPLETED: PaymentStatus.PAID,
      APPROVED: PaymentStatus.PENDING,
      VOIDED: PaymentStatus.FAILED,
      PAYER_ACTION_REQUIRED: PaymentStatus.PENDING,
    };

    return {
      providerTransactionId,
      status: statusMap[data.status] || PaymentStatus.PENDING,
      rawPayload: data,
    };
  }

  /**
   * Handle PayPal Webhooks
   */
  async handleWebhook(payload: Record<string, any>): Promise<PaymentVerifyResult> {
    const orderId = payload.resource?.id;
    const eventType = payload.event_type;

    let status: PaymentStatus = PaymentStatus.PENDING;

    if (eventType === 'CHECKOUT.ORDER.COMPLETED') {
      status = PaymentStatus.PAID;
    } else if (eventType === 'CHECKOUT.ORDER.VOIDED') {
      status = PaymentStatus.FAILED;
    }

    return {
      providerTransactionId: orderId,
      status,
      rawPayload: payload,
    };
  }
}