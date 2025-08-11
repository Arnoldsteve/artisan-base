import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from '../../common/interceptors/transform-response.interceptor';
// Reusing the existing service from the platform module
import { PlatformPlansService } from '../../platform/plans/platform-plans.service';

// It's good practice to namespace the controller route to match its location
@Controller('dashboard/billing')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class BillingController {
  constructor(private readonly plansService: PlatformPlansService) {}

  /**
   * This public-facing endpoint allows an authenticated tenant user to see
   * all available subscription plans they can choose from.
   */
  @Get('plans')
  findAllAvailablePlans() {
    return this.plansService.findAllPlans();
  }

  // NOTE: You will add the endpoints for fetching the tenant's specific
  // subscription and invoices here later.
  // @Get('subscription')
  // @Get('invoices')
}