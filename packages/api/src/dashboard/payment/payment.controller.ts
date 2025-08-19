// import { Controller, Post, Body, Scope, UseGuards, Get, Logger, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
// import { PaymentService } from './payment.service';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
// import { CapturePayPalOrderDto } from './dto/capture-payment.dto';
// import { MpesaStkCallbackDto } from './dto/mpesa-stk-callback.dto';

// @Controller({
//   path: 'dashboard/payments', // The base path for all payment-related routes
//   scope: Scope.REQUEST,
// })
// @UseGuards(JwtAuthGuard) // All payment routes should be protected
// export class PaymentController {
//   private readonly logger = new Logger(PaymentController.name);

//   constructor(private readonly paymentService: PaymentService) {}

//   /**
//    * Endpoint for the frontend to create a payment intent.
//    * This will eventually return a client_secret or redirect URL.
//    */
//    @Post('intent')
//   createPaymentIntent(@Body(ValidationPipe) dto: CreatePaymentIntentDto) {
//     this.logger.log('Received request to create payment intent...');
//     console.log('Validated DTO:', dto); // This should now log the object
//     return this.paymentService.createPaymentIntent(dto);
//   }

//   /**
//    * Endpoint for receiving webhooks from a payment provider (e.g., Stripe, PayPal).
//    * This route should NOT have the JwtAuthGuard, as it's called by an external service.
//    */
//   @Post('webhook/stripe') // Example for Stripe
//   @UseGuards() // This effectively removes the controller-level guard for this one route
//   handleStripeWebhook(@Body() event: any) {
//     this.logger.log('Received Stripe Webhook!');
//     // This will eventually contain signature verification and event handling logic.
//     return this.paymentService.handleWebhookEvent(event);
//   }

//   @Post('webhook/mpesa')
//   @UseGuards() 
//   @HttpCode(HttpStatus.OK)
//   async handleMpesaWebhook(@Body() callbackData: MpesaStkCallbackDto) {
//      this.logger.log('Received M-Pesa Webhook:', JSON.stringify(callbackData));
//      // We will create this method in the service next
//      await this.paymentService.handleMpesaStkCallback(callbackData); 
//      // Acknowledge receipt to M-Pesa
//      return { ResultCode: 0, ResultDesc: 'Accepted' };
//    }
   

//    @Post('capture/paypal')
//   capturePayPalOrder(@Body(ValidationPipe) dto: CapturePayPalOrderDto) {
//     this.logger.log(`Received request to capture PayPal order: ${dto.paypalOrderId}`);
//     // This calls the service layer to handle the business logic
//     return this.paymentService.capturePayPalOrder(dto);
//   }


//   @Get('setup-mpesa')
//   @UseGuards() // Unguarded for easy setup
//   setupMpesa() {
//     this.logger.log('Triggering M-Pesa C2B URL registration...');
//     return this.paymentService.registerMpesaUrls(); // We'll add this to PaymentService next
//   }

// }