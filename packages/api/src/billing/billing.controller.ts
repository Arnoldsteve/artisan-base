import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { BillingService } from './billing.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';

/**
 * Billing Controller.
 * Handles tenant subscription management and Stripe billing webhooks.
 * Mpesa subscription webhooks flow through /payments/webhook/mpesa → payment.updated event.
 */
@ApiTags('Billing')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // ─── Plans ───────────────────────────────────────────────────────────────────

  @Get('plans')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all available subscription plans' })
  async getPlans() {
    return this.billingService.getPlans();
  }

  // ─── Subscription ─────────────────────────────────────────────────────────────

  @Get('subscription')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current tenant subscription' })
  async getSubscription() {
    return this.billingService.getSubscription();
  }

  @Post('subscribe')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Subscribe tenant to a plan',
    description:
      'Intelligently routes to Stripe (USD/EUR/GBP) or Mpesa (KES) based on tenant currency',
  })
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.billingService.subscribe(dto);
  }

  @Patch('change-plan')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade or downgrade subscription plan' })
  async changePlan(@Body() dto: ChangePlanDto) {
    return this.billingService.changePlan(dto);
  }

  @Patch('cancel')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel tenant subscription' })
  @ApiQuery({
    name: 'immediately',
    required: false,
    type: Boolean,
    description: 'true = cancel now | false = cancel at period end',
  })
  async cancel(@Query('immediately') immediately?: string) {
    return this.billingService.cancel(immediately === 'true');
  }

  // ─── Stripe Billing Webhook ──────────────────────────────────────────────────

  @Post('webhook/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe billing webhook endpoint' })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.billingService.handleStripeWebhook(
      req.rawBody as any,
      signature,
    );
  }

  // ─── History ─────────────────────────────────────────────────────────────────

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment history for the current tenant' })
  @ApiResponse({ status: 200, description: 'List of past transactions.' })
  async getHistory() {
    return this.billingService.getHistory();
  }
}