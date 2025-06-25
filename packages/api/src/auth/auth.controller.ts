// In packages/api/src/auth/auth.controller.ts
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    Logger.log('Received sign-up request', signUpDto);
    return this.authService.signUp(signUpDto);
  }
}