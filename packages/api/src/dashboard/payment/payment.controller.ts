import { Controller, Post, Body, Scope, UseGuards, Get, Logger, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CapturePayPalOrderDto } from './dto/capture-payment.dto';

@Controller({
  path: 'dashboard/payments', // The base path for all payment-related routes
  scope: Scope.REQUEST,
})
@UseGuards(JwtAuthGuard) // All payment routes should be protected
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Endpoint for the frontend to create a payment intent.
   * This will eventually return a client_secret or redirect URL.
   */
   @Post('intent')
  createPaymentIntent(@Body(ValidationPipe) dto: CreatePaymentIntentDto) {
    this.logger.log('Received request to create payment intent...');
    console.log('Validated DTO:', dto); // This should now log the object
    return this.paymentService.createPaymentIntent(dto);
  }

  /**
   * Endpoint for receiving webhooks from a payment provider (e.g., Stripe, PayPal).
   * This route should NOT have the JwtAuthGuard, as it's called by an external service.
   */
  @Post('webhook/stripe') // Example for Stripe
  @UseGuards() // This effectively removes the controller-level guard for this one route
  handleStripeWebhook(@Body() event: any) {
    this.logger.log('Received Stripe Webhook!');
    // This will eventually contain signature verification and event handling logic.
    return this.paymentService.handleWebhookEvent(event);
  }

   @Post('capture/paypal')
  capturePayPalOrder(@Body(ValidationPipe) dto: CapturePayPalOrderDto) {
    this.logger.log(`Received request to capture PayPal order: ${dto.paypalOrderId}`);
    // This calls the service layer to handle the business logic
    return this.paymentService.capturePayPalOrder(dto);
  }
}