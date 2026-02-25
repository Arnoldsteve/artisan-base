import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantId } from '@/auth/decorators/tenant-id.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true })
@Controller('analytics')
@UseGuards(JwtAuthGuard, TenantMembershipGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * millions of users: Primary data source for the Dashboard Home Page.
   */
  @Get('summary')
  @ApiOperation({ summary: 'Get store performance metrics and chart data' })
  async getSummary(@TenantId() tenantId: string) {
    return this.analyticsService.getDashboardSummary(tenantId);
  }
}