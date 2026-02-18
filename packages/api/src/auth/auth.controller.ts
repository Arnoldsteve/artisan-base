import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  UseGuards,
  Query,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

/**
 * SOLID Principle: Interface Segregation
 * This controller handles global authentication. It allows users to
 * verify their identity before they choose which tenant to manage.
 */
@ApiTags('Authentication')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Global Login Endpoint.
   * Returns a JWT and a list of tenants the user belongs to.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return accessible tenants' })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials provided.',
  })
  async login(@Body() loginDto: LoginDto) {
    Logger.debug('login  dto in the controller', loginDto);
    // 1. Verify the user (Email & Password)
    const user = await this.authService.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Generate Tokens and find associated Tenants
    return this.authService.login(user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@GetUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  /**
   * Note: We will add 'Logout' and 'Refresh Token' endpoints here next.
   */

  @Get('bootstrap')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Bootstrap the workspace',
    description:
      'Initializes the tenant workspace by aggregating user, tenant, products, and categories.',
  })
  @ApiResponse({ status: 200, description: 'Bootstrap successful' })
  async bootstrap(
    @GetUser('id') userId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.authService.bootstrap(userId, tenantId);
  }
}
