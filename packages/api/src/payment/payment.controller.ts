import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentProvider } from './enums/payment-provider.enum';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*
   ---------------------------------------------------------
   Initialize Payment
   ---------------------------------------------------------
   */
  @Post('initialize')
  async initialize(@Body() dto: InitializePaymentDto) {
    return this.paymentService.initialize(dto);
  }

  /*
   ---------------------------------------------------------
   Verify Payment (Manual Trigger)
   ---------------------------------------------------------
   */
  @Post('verify')
  async verify(@Body() dto: VerifyPaymentDto) {
    return this.paymentService.verify(dto);
  }

  /*
   ---------------------------------------------------------
   Get Payment by ID
   ---------------------------------------------------------
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }

  /*
   ---------------------------------------------------------
   Get Payments by Order
   ---------------------------------------------------------
   */
  @Get('order/:orderId')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.paymentService.findByOrder(orderId);
  }

  /*
   ---------------------------------------------------------
   Webhook Endpoint
   ---------------------------------------------------------
   Provider-specific webhook:
   POST /payments/webhook/mpesa
   POST /payments/webhook/stripe
   */
  @Post('webhook/:provider')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('provider') provider: PaymentProvider,
    @Body() payload: Record<string, any>,
    @Headers('stripe-signature') stripeSignature?: string,
  ) {
    return this.paymentService.handleWebhook(
      provider,
      payload,
      stripeSignature,
    );
  }
}
