import {
  Injectable,
  OnModuleInit,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, PaymentStatus } from '@generated/prisma/client';
import { firstValueFrom } from 'rxjs';
import {
  IPaymentProvider,
  PaymentFulfillmentType,
  PaymentInitParams,
  PaymentInitResult,
  PaymentVerifyResult,
} from '../interfaces/payment-provider.interface';
import { PaymentProviderRegistry } from './payment-provider.registry';

@Injectable()
export class MpesaProvider implements IPaymentProvider, OnModuleInit {
  private readonly logger = new Logger(MpesaProvider.name);

  private readonly baseUrl: string;
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly shortCode: string;
  private readonly passkey: string;
  private readonly callbackUrl: string;

  constructor(
    private readonly registry: PaymentProviderRegistry,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('MPESA_BASE_URL'); // https://sandbox.safaricom.co.ke or live
    this.consumerKey = this.config.get<string>('MPESA_CONSUMER_KEY');
    this.consumerSecret = this.config.get<string>('MPESA_CONSUMER_SECRET');
    this.shortCode = this.config.get<string>('MPESA_SHORTCODE');
    this.passkey = this.config.get<string>('MPESA_PASSKEY');
    this.callbackUrl = this.config.get<string>('MPESA_CALLBACK_URL'); // your /payments/webhook/mpesa
  }

  onModuleInit() {
    this.registry.register(this);
  }

  getName(): PaymentProvider {
    return PaymentProvider.MPESA;
  }

  /**
   * ✅ NEW: Implement Fulfillment Type
   * millions of users: We return PUSH to signal that this is an
   * asynchronous background-safe operation.
   */
  getFulfillmentType(): PaymentFulfillmentType {
    return PaymentFulfillmentType.PUSH;
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
    ).toString('base64');

    const { data } = await firstValueFrom(
      this.http.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: { Authorization: `Basic ${credentials}` },
        },
      ),
    );

    return data.access_token;
  }

  private getTimestamp(): string {
    return new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);
  }

  private getPassword(timestamp: string): string {
    return Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString(
      'base64',
    );
  }

  // ─── IPaymentProvider Implementation ────────────────────────────────────────

  /**
   * Initiates Mpesa STK Push (Lipa Na Mpesa Online)
   * Phone receives a prompt to enter their PIN
   */
  async initialize(params: PaymentInitParams): Promise<PaymentInitResult> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = this.getPassword(timestamp);

    if (!params.phone) {
      throw new BadRequestException('M-Pesa requires a valid phone number');
    }

    const phone = params.phone.replace(/^0/, '254').replace(/^\+/, '');
    const amount = Math.ceil(params.amount);

    const { data } = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phone,
          PartyB: this.shortCode,
          PhoneNumber: phone,
          CallBackURL: this.callbackUrl,
          AccountReference: params.reference,
          TransactionDesc: params.description ?? 'Payment',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );

    this.logger.log(`STK Push sent to ${phone} | Ref: ${params.reference}`);

    return {
      providerTransactionId: data.CheckoutRequestID,
      stkPushRequestId: data.CheckoutRequestID,
      metadata: {
        merchantRequestId: data.MerchantRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        phone,
      },
    };
  }

  /**
   * Query STK Push status from Daraja
   */

  async verify(providerTransactionId: string): Promise<PaymentVerifyResult> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = this.getPassword(timestamp);

    const { data } = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: providerTransactionId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    const status =
      data.ResultCode === '0'
        ? PaymentStatus.PAID
        : data.ResultCode === '1032'
          ? PaymentStatus.FAILED
          : PaymentStatus.PENDING;

    return {
      providerTransactionId,
      status,
      rawPayload: data,
    };
  }

  /**
   * Parses Mpesa callback from Daraja
   * POST /payments/webhook/mpesa
   */

  async handleWebhook(
    payload: Record<string, any>,
  ): Promise<PaymentVerifyResult> {
    const stkCallback = payload?.Body?.stkCallback;

    if (!stkCallback) {
      this.logger.warn('Invalid Mpesa webhook payload');
      return { providerTransactionId: '', status: PaymentStatus.FAILED };
    }

    const checkoutRequestId: string = stkCallback.CheckoutRequestID;
    const resultCode: number = stkCallback.ResultCode;

    let status: PaymentStatus;

    switch (resultCode) {
      case 0:
        status = PaymentStatus.PAID;
        break;
      case 1032:
      case 1037:
        status = PaymentStatus.FAILED;
        break;
      default:
        status = PaymentStatus.FAILED;
    }

    return {
      providerTransactionId: checkoutRequestId,
      status,
      rawPayload: payload,
    };
  }
}
