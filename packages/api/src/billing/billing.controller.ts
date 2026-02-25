import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';

@ApiTags('Billing')
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('billing')
@UseGuards(JwtAuthGuard, TenantMembershipGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all available subscription plans' })
  async getPlans() {
    return this.billingService.getPlans();
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get current tenant subscription' })
  async getSubscription() {
    return this.billingService.getSubscription();
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe store to a plan' })
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.billingService.subscribe(dto);
  }

  @Patch('change-plan')
  @ApiOperation({ summary: 'Upgrade or downgrade plan' })
  async changePlan(@Body() dto: ChangePlanDto) {
    return this.billingService.changePlan(dto);
  }

  @Patch('cancel')
  @ApiQuery({ name: 'immediately', required: false, type: Boolean })
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancel(@Query('immediately') immediately?: string) {
    return this.billingService.cancel(immediately === 'true');
  }

  @Get('history')
  @ApiOperation({ summary: 'Get store payment history' })
  async getHistory() {
    return this.billingService.getHistory();
  }
}