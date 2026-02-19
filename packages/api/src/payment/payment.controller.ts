import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentProvider } from '@generated/prisma/client';
import { PaymentService, InitiatePaymentParams } from './payment.service';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiatePaymentDto implements InitiatePaymentParams {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'KES' })
  @IsString()
  currency: string;

  @ApiPropertyOptional({ example: '254712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  returnUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  orderId?: string;
}

/**
 * Pure infrastructure controller.
 * No business logic — delegates entirely to PaymentService.
 * Stripe requires raw body for webhook signature verification.
 */
@ApiTags('Payments')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*
   ─────────────────────────────────────────────
   Initiate Payment
   Called by frontend after order is created.
   ─────────────────────────────────────────────
   */
  @Post('initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate a payment via Mpesa or Stripe' })
  async initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentService.initiate(dto);
  }

  /*
   ─────────────────────────────────────────────
   Manual Verify (Polling)
   Useful for Mpesa STK — frontend polls this
   after STK push to check if user paid.
   ─────────────────────────────────────────────
   */
  @Get(':paymentId/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually verify payment status (polling)' })
  @ApiParam({ name: 'paymentId', description: 'Internal payment ID' })
  async verify(@Param('paymentId') paymentId: string) {
    return this.paymentService.verify(paymentId);
  }

  /*
   ─────────────────────────────────────────────
   Stripe Webhook
   POST /payments/webhook/stripe
   Requires raw body for signature verification.
   ─────────────────────────────────────────────
   */
  @Post('webhook/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    // Pass raw buffer — Stripe needs this for signature verification
    return this.paymentService.handleWebhook(
      PaymentProvider.STRIPE,
      req.rawBody as any,
      signature,
    );
  }

  /*
   ─────────────────────────────────────────────
   Mpesa Webhook
   POST /payments/webhook/mpesa
   Daraja posts JSON — no signature, just parse.
   ─────────────────────────────────────────────
   */
  @Post('webhook/mpesa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mpesa Daraja callback endpoint' })
  async mpesaWebhook(@Body() payload: Record<string, any>) {
    return this.paymentService.handleWebhook(PaymentProvider.MPESA, payload);
  }
}