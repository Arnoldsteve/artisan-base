import { Body, Controller, Post, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * SOLID Principle: Interface Segregation
 * This controller handles global authentication. It allows users to 
 * verify their identity before they choose which tenant to manage.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Global Login Endpoint.
   * Returns a JWT and a list of tenants the user belongs to.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return accessible tenants' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully authenticated.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials provided.' 
  })
  async login(@Body() loginDto: LoginDto) {
    // 1. Verify the user (Email & Password)
    const user = await this.authService.validateUser(loginDto);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Generate Tokens and find associated Tenants
    return this.authService.login(user);
  }

  /**
   * Note: We will add 'Logout' and 'Refresh Token' endpoints here next.
   */
}