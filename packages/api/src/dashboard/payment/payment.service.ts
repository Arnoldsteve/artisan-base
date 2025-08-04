import { Injectable, Scope, BadRequestException, Logger } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { TenantContextService } from 'src/common/tenant-context.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PayPalService } from './paypal/paypal.service'; // <-- 1. IMPORT PayPalService
import { CapturePayPalOrderDto } from './dto/capture-payment.dto';
import { MpesaService } from './mpesa/mpesa.service';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly payPalService: PayPalService, // <-- 2. INJECT PayPalService
    private readonly mpesaService: MpesaService, // <-- 2. INJECT

    private readonly tenantContext: TenantContextService,
  ) {}

  async createPaymentIntent(dto: CreatePaymentIntentDto) {
    // The ValidationPipe has already checked the DTO, so we can trust the data.

    // --- 3. UPDATE THE SWITCH LOGIC ---
    switch (dto.method) {
      case 'stripe_card': {
        const paymentIntent = await this.stripeService.createPaymentIntent(
          dto.amount,
          dto.currency,
        );

        if (!paymentIntent.client_secret) {
          throw new Error('Failed to retrieve client_secret from Stripe.');
        }

        // Here we would associate the Stripe paymentIntent.id with our order
        this.logger.log(
          `Associated Stripe Payment Intent ${paymentIntent.id} with order: ${dto.orderId}`,
        );

        return {
          message: 'Stripe Payment Intent created successfully.',
          provider: 'stripe',
          clientSecret: paymentIntent.client_secret,
        };
      }

      case 'paypal': {
        const payPalOrder = await this.payPalService.createOrder(
          dto.amount,
          dto.currency,
        );

        // Find the specific 'approve' link from the response
        const approvalLink = payPalOrder.links.find(
          (link) => link.rel === 'approve',
        );

        if (!approvalLink) {
          throw new Error('Could not find PayPal approval link.');
        }

        // Here we would associate the PayPal order ID with our own order
        this.logger.log(
          `Associated PayPal Order ${payPalOrder.id} with order: ${dto.orderId}`,
        );

        return {
          message: 'PayPal order created successfully.',
          provider: 'paypal',
          approvalLink: approvalLink.href, // Return the URL for the frontend to redirect to
        };
      }

      case 'mpesa': {
        // A. Validate that the phone number was provided for M-Pesa payments
        if (!dto.phoneNumber) {
          throw new BadRequestException(
            'Phone number is required for M-Pesa payments.',
          );
        }

        // B. Delegate the STK Push initiation to the M-Pesa specialist
        const mpesaResponse = await this.mpesaService.initiateStkPush(
          dto.amount,
          dto.phoneNumber,
          dto.orderId,
        );

        // C. Here we would save the CheckoutRequestID from mpesaResponse to our order
        //    This allows us to link the callback to the original order.
        this.logger.log(
          `Associated M-Pesa CheckoutRequestID ${mpesaResponse.CheckoutRequestID} with order: ${dto.orderId}`,
        );

        // D. Return a simple success message. The rest of the flow is asynchronous.
        return {
          message:
            'M-Pesa STK Push initiated successfully. Please check your phone to complete the payment.',
          provider: 'mpesa',
          checkoutRequestID: mpesaResponse.CheckoutRequestID,
        };
      }

      default:
        // This should not be reachable due to the DTO validation, but it's safe to have.
        this.logger.error(`Unsupported payment method received: ${dto.method}`);
        throw new BadRequestException('Unsupported payment method specified.');
    }
  }

  handleWebhookEvent(event: any) {
    // This logic will be expanded later
    return {
      message: 'Webhook received. Logic not yet implemented.',
    };
  }

  // 4. ADD THE CAPTURE LOGIC FOR PAYPAL
  async capturePayPalOrder(dto: CapturePayPalOrderDto) {
    const { paypalOrderId } = dto;

    // 1. Tell our PayPal specialist to finalize the payment
    const captureData = await this.payPalService.captureOrder(paypalOrderId);

    // 2. Perform crucial business logic based on the result
    if (captureData.status === 'COMPLETED') {
      this.logger.log(
        `Payment successful for PayPal Order ID: ${paypalOrderId}`,
      );

      // THIS IS WHERE YOU UPDATE YOUR OWN DATABASE
      // In the future, you will:
      //  a. Find your internal order that matches this paypalOrderId.
      //  b. Update its status to 'PAID'.
      //  c. Send a confirmation email.

      return {
        message: 'Payment captured successfully.',
        status: captureData.status,
        // Return the final transaction ID for your records
        transactionId: captureData.purchase_units[0]?.payments?.captures[0]?.id,
      };
    } else {
      // This handles cases where the user approved, but the payment failed to capture.
      this.logger.warn(
        `PayPal capture status was NOT 'COMPLETED': ${captureData.status}`,
      );
      throw new BadRequestException(
        `Payment could not be completed. Status: ${captureData.status}`,
      );
    }
  }
}
