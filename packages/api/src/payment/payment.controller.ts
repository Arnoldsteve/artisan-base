import {
  Controller,
  Post,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { PaymentProvider } from '@generated/prisma/client';

@ApiTags('Payments')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*
   ---------------------------------------------------------
   Initialize Payment
   ---------------------------------------------------------
   */
  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a payment for an order' })
  @ApiBearerAuth()
  async initialize(@Body() dto: InitializePaymentDto) {
    return this.paymentService.initialize(dto);
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
  @ApiOperation({ summary: 'Receive payment provider webhooks' })
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
