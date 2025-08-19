// File: .../payment/paypal/paypal.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private readonly logger = new Logger(PayPalService.name);
  private client: paypal.core.PayPalHttpClient;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const environment = this.configService.get<string>('PAYPAL_ENVIRONMENT');

    if (!clientId || !clientSecret || !environment) {
      throw new Error('PayPal credentials are not fully configured.');
    }

    // 2. Set up the PayPal environment
    const payPalEnvironment =
      environment === 'live'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    // 3. Create the HTTP client
    this.client = new paypal.core.PayPalHttpClient(payPalEnvironment);
    this.logger.log(`PayPalService initialized for ${environment} environment.`);
  }

  /**
   * Creates a PayPal order.
   * This is the first step in the PayPal payment flow.
   * @param amount The total amount of the order.
   * @param currency The three-letter currency code (e.g., 'USD').
   * @returns The created order object from PayPal, including the approval link.
   */
  async createOrder(amount: number, currency: string) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2), // Ensure two decimal places
          },
        },
      ],
    });

    try {
      const order = await this.client.execute(request);
      this.logger.log(`Created PayPal Order ID: ${order.result.id}`);
      return order.result;
    } catch (error) {
      this.logger.error('Failed to create PayPal order', error);
      // It's often helpful to log the detailed error from PayPal
      console.error(JSON.stringify(error.result, null, 2));
      throw new Error('Could not create PayPal order.');
    }
  }

  
    /**
   * Captures the payment for a PayPal order that has been approved by the user.
   * This is the final step to move the money.
   * @param paypalOrderId The token/ID provided by PayPal after user approval.
   * @returns The full details of the captured transaction from PayPal.
   */
  async captureOrder(paypalOrderId: string) {
    // This creates the request to capture a specific order
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({}); // The body is empty for a capture request

    try {
      // Execute the request and get the result
      const capture = await this.client.execute(request);
      this.logger.log(`Successfully Captured PayPal Order ID: ${capture.result.id}`);
      
      // Return the successful capture details
      return capture.result;
    } catch (error) {
      // If something goes wrong, log the detailed error from PayPal
      this.logger.error(`Failed to capture PayPal Order ID: ${paypalOrderId}`, error);
      console.error(JSON.stringify(error.result, null, 2)); // Helps with debugging
      throw new Error('Could not capture the PayPal payment.');
    }
  }
}