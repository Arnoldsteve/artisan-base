import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from '../common/interceptors/transform-response.interceptor';
import { BillingService } from './billing.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('billing')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  /**
   * Endpoint for the tenant dashboard to fetch the tenant's current subscription.
   */
  @Get('subscription')
  getSubscription() {
    return this.billingService.getSubscription();
  }

  /**
   * Endpoint for the tenant dashboard to initiate a plan change.
   */
  @Post('create-checkout-session')
  createCheckoutSession(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.billingService.createCheckoutSession(createCheckoutDto);
  }
}