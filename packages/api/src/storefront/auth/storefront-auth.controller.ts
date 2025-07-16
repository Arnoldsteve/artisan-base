import { Controller, Post, Body } from '@nestjs/common';
import { StorefrontAuthService } from './storefront-auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';

@Controller('storefront/auth')
export class StorefrontAuthController {
  constructor(private readonly authService: StorefrontAuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('complete-registration')
  completeRegistration(@Body() dto: CompleteRegistrationDto) {
    return this.authService.completeRegistration(dto);
  }
}
