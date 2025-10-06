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

  @Get('subscription')
  getSubscription() {
    return this.billingService.getSubscription();
  }
  
  @Get('invoices')
  getInvoices() {
    return this.billingService.getInvoicesForCurrentTenant();
  }

  @Post('create-checkout-session')
  createCheckoutSession(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.billingService.createCheckoutSession(createCheckoutDto);
  }
}