// File: .../payment/mpesa/mpesa.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// Define a simple in-memory cache for the auth token
interface MpesaToken {
  token: string;
  expires: number; // Expiry timestamp in milliseconds
}

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly shortCode: string;
  private readonly passkey: string;
  private readonly apiUrl: string;
  private readonly callbackUrl: string;

  private tokenCache: MpesaToken | null = null;

 
  constructor(private configService: ConfigService) {
    const environment = this.configService.get<string>('MPESA_ENVIRONMENT');

    // --- THIS IS THE FIX ---
    // 1. Get the values from ConfigService into local constants.
    //    These constants will have the type `string | undefined`.
    const consumerKey = this.configService.get<string>('MPESA_CONSUMER_KEY');
    const consumerSecret = this.configService.get<string>('MPESA_CONSUMER_SECRET');
    const shortCode = this.configService.get<string>('MPESA_BUSINESS_SHORTCODE');
    const passkey = this.configService.get<string>('MPESA_PASSKEY');

    // 2. Perform the null/undefined check on the local constants.
    if (!consumerKey || !consumerSecret || !shortCode || !passkey) {
      throw new Error('M-Pesa credentials are not fully configured.');
    }

    // 3. After the check, TypeScript knows these constants MUST be strings.
    //    Now it is safe to assign them to the class properties.
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.shortCode = shortCode;
    this.passkey = passkey;
    // -----------------------------------------------------------------

    this.apiUrl =
      environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';
        
    const apiBaseUrl = this.configService.get<string>('API_BASE_URL');
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL is not configured in .env');
    }
    this.callbackUrl = `${apiBaseUrl}/api/v1/dashboard/payments/webhook/mpesa`;

    this.logger.log(`MpesaService initialized for ${environment} environment.`);
  }
  /**
   * Gets a valid Daraja API auth token, fetching a new one if needed.
   */
  private async getAuthToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expires > Date.now()) {
      return this.tokenCache.token;
    }

    this.logger.log('Fetching new M-Pesa auth token...');
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');

    try {
      const response = await axios.get(`${this.apiUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` },
      });

      const token = response.data.access_token;
      const expiresIn = response.data.expires_in; // in seconds

      this.tokenCache = {
        token: token,
        expires: Date.now() + (expiresIn - 60) * 1000, // Store expiry with a 60s buffer
      };

      return token;
    } catch (error) {
      this.logger.error('Failed to get M-Pesa auth token', error.response?.data);
      throw new Error('Could not authenticate with M-Pesa.');
    }
  }

  /**
   * Initiates an STK Push payment prompt to the user's phone.
   */
  async initiateStkPush(amount: number, phoneNumber: string, orderId: string) {
    const token = await this.getAuthToken();
    
    // 1. Generate Timestamp (YYYYMMDDHHMMSS)
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);

    // 2. Generate Password (Base64 of Shortcode + Passkey + Timestamp)
    const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: this.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount), // Amount must be an integer
      PartyA: phoneNumber, // User's phone number
      PartyB: this.shortCode, // Same as BusinessShortCode
      PhoneNumber: phoneNumber,
      CallBackURL: this.callbackUrl,
      AccountReference: orderId, // Crucial for identifying the order later
      TransactionDesc: `Payment for Order ${orderId}`,
    };

    try {
      const response = await axios.post(`${this.apiUrl}/mpesa/stkpush/v1/processrequest`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      this.logger.log('Successfully initiated STK Push.', response.data);
      return response.data; // This contains CheckoutRequestID
    } catch (error) {
      this.logger.error('Failed to initiate M-Pesa STK Push', error.response?.data);
      throw new Error('Could not initiate M-Pesa payment.');
    }
  }

  // We will add the logic for processing the callback in a later step.
}