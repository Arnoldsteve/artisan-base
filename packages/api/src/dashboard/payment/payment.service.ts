import { Injectable, Scope, BadRequestException, Logger } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { TenantContextService } from 'src/common/tenant-context.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PayPalService } from './paypal/paypal.service'; 
import { CapturePayPalOrderDto } from './dto/capture-payment.dto';
import { MpesaService } from './mpesa/mpesa.service';
import { MpesaStkCallbackDto } from './dto/mpesa-stk-callback.dto';
import { Currency, PaymentProvider, PaymentStatus } from 'generated/tenant';
import { StorefrontOrderRepository } from 'src/storefront/orders/storefront-order.repository';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly payPalService: PayPalService, 
    private readonly mpesaService: MpesaService, 

    private readonly tenantContext: TenantContextService,
    private readonly orderRepository: StorefrontOrderRepository, 
  ) {}

  async createPaymentIntent(dto: CreatePaymentIntentDto) {
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
        if (!dto.phoneNumber) {
          throw new BadRequestException('Phone number is required for M-Pesa payments.');
        }

        const mpesaResponse = await this.mpesaService.initiateStkPush(
          dto.amount,
          dto.phoneNumber,
          dto.orderId,
        );

        // --- THIS IS THE CRUCIAL UPDATE ---
        // Create a PENDING payment record immediately to store the CheckoutRequestID
        await this.orderRepository.createPayment({
          orderId: dto.orderId,
          provider: PaymentProvider.MPESA,
          amount: dto.amount,
          currency: Currency.KES, 
          status: PaymentStatus.PENDING,
          providerTransactionId: mpesaResponse.CheckoutRequestID, 
          checkoutRequestId: mpesaResponse.CheckoutRequestID, 
          metadata: {
            phoneNumber: dto.phoneNumber,
          },
        });
        
        this.logger.log(`Associated M-Pesa CheckoutRequestID ${mpesaResponse.CheckoutRequestID} with order: ${dto.orderId}`);

        return {
          message: 'M-Pesa STK Push initiated successfully. Please check your phone to complete the payment.',
          provider: 'mpesa',
          checkoutRequestID: mpesaResponse.CheckoutRequestID,
        };
      }
      default:
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

  async handleMpesaStkCallback(callbackData: MpesaStkCallbackDto) {
    this.logger.log('Handling M-Pesa STK callback in PaymentService...');

    const stkCallback = callbackData.Body.stkCallback;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    const order = await this.orderRepository.findOrderByCheckoutRequestId(checkoutRequestId);
    if (!order) {
      this.logger.error(`Webhook Error: Could not find Order matching CheckoutRequestID: ${checkoutRequestId}`);
      // Even if we don't find the order, we must return success to M-Pesa
      return;
    }

    if (resultCode === 0) {
      // --- PAYMENT WAS SUCCESSFUL ---
      this.logger.log(`Successful payment for Order ID: ${order.id}`);

      // Extract details from the callback metadata
     let mpesaReceipt: string | number | undefined;
      if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
      const metadata = stkCallback.CallbackMetadata.Item;
      mpesaReceipt = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      }

      // Update the Order status in a transaction for safety
      await this.orderRepository.updateOrderStatus(order.id, {
        paymentStatus: PaymentStatus.PAID,
        status: 'CONFIRMED', // Or 'PROCESSING' depending on your business logic
      });

      // Update the Payment record with the final transaction ID
      // (This requires adding an `updatePayment` method to the repository)
      // For now, we will log it.
      this.logger.log(`TODO: Update Payment record for Order ${order.id} with MpesaReceiptNumber: ${mpesaReceipt}`);
      
    } else {
      // --- PAYMENT FAILED OR WAS CANCELLED ---
      this.logger.warn(`M-Pesa payment failed for Order ID: ${order.id}. Reason: ${stkCallback.ResultDesc}`);
      await this.orderRepository.updateOrderStatus(order.id, {
        paymentStatus: PaymentStatus.FAILED,
      });
    }
  }

  async registerMpesaUrls() {
    return this.mpesaService.registerC2BUrls();
  }
}
