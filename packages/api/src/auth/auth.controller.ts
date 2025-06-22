// In packages/api/src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common'; // <-- 1. Add HttpCode and HttpStatus
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express'; // <-- Import Response from express

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto.email, signUpDto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginData = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    res.cookie('access_token', loginData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // This is still correct
      sameSite: 'lax', // <-- THE FINAL FIX
      domain: 'localhost', // Keeping this is a good, explicit practice
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }
}