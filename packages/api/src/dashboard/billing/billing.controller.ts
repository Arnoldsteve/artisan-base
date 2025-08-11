import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from '../../common/interceptors/transform-response.interceptor';
import { PlatformPlansService } from '../../platform/plans/platform-plans.service';
import { BillingService } from './billing.service'; // Import the new service

@Controller('dashboard/billing')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class BillingController {
  constructor(
    // We inject BOTH services
    private readonly plansService: PlatformPlansService,
    private readonly billingService: BillingService,
  ) {}

  /**
   * Fetches all available subscription plans.
   * This is a platform-wide, read-only operation.
   */
  @Get('plans')
  findAllAvailablePlans() {
    return this.plansService.findAllPlans();
  }

  /**
   * Fetches the current subscription details for the authenticated tenant.
   * This is a tenant-specific operation.
   */
  @Get('subscription')
  getSubscription() {
    return this.billingService.getSubscriptionForCurrentTenant();
  }

  /**
   * Fetches the invoice history for the authenticated tenant.
   * This is a tenant-specific operation.
   */
  @Get('invoices')
  getInvoices() {
    return this.billingService.getInvoicesForCurrentTenant();
  }

  /**
   * Initiates a plan change for the authenticated tenant.
   * This is a tenant-specific action.
   */
  @Post('change-plan')
  changePlan(@Body('planId') planId: string) {
    return this.billingService.changePlanForCurrentTenant(planId);
  }
}