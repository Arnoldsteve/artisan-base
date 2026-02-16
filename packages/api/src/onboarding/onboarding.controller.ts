import { Body, Controller, Post, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { CheckSubdomainDto } from '../tenant/dto/check-subdomain.dto';

/**
 * SOLID Principle: Interface Segregation
 * This controller handles public entry points where no Tenant context exists yet.
 */
@ApiTags('Platform Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * Endpoint to register a new tenant and owner.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new tenant and administrative owner' })
  @ApiResponse({ status: 201, description: 'Tenant and User successfully created.' })
  @ApiResponse({ status: 409, description: 'Subdomain or Email already exists.' })
  async register(@Body() dto: RegisterTenantDto) {
    const result = await this.onboardingService.register(dto);
    return {
      message: 'Onboarding successful. Welcome to the platform!',
      data: result,
    };
  }

  /**
   * Endpoint to check if a subdomain is available.
   * Public: No authentication required.
   */
  @Get('check-subdomain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if a specific store subdomain is available' })
  @ApiResponse({ status: 200, description: 'Returns availability status.' })
  async checkSubdomain(@Query() dto: CheckSubdomainDto) {
    return this.onboardingService.checkSubdomainAvailability(dto);
  }
}