import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    Logger.log('Received sign-up request', signUpDto);
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) 
  async login(@Body() loginDto: LoginDto) {
    Logger.log('Received login request', loginDto);
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile() {
    Logger.log('Received profile request');
    // Implement your logic here, e.g., return user profile
    return { message: 'Profile endpoint' };
  }
}
