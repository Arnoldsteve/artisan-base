import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';

/**
 * SOLID Principle: Interface Segregation
 * This controller handles ONLY the public entry into the platform.
 * It is excluded from TenantGuards because the tenant doesn't exist yet.
 */
@ApiTags('Platform Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * Endpoint to register a new tenant/store.
   * This is the "Big Bang" for a new store on your platform.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new tenant and administrative owner' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tenant and User successfully created.' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Subdomain or Email already exists.' 
  })
  async register(@Body() dto: RegisterTenantDto) {
    // We delegate the heavy lifting to the service
    const result = await this.onboardingService.register(dto);

    return {
      message: 'Onboarding successful. Welcome to the platform!',
      data: result,
    };
  }
}