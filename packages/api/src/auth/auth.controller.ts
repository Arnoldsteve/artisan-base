// In packages/api/src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common'; // <-- 1. Add HttpCode and HttpStatus
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto'; // <-- 2. Import the new DTO
import { AuthGuard } from '@nestjs/passport'; // <-- Import


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto.email, signUpDto.password);
  }

  // 3. Add the new login endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK) // 4. Set the success status code to 200 OK
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

   @Get('profile')
  @UseGuards(AuthGuard('jwt')) // This is the guard that protects the route
  getProfile(@Request() req) {
    // Because of our JwtStrategy's `validate` method, `req.user`
    // now contains the user object we fetched from the database.
    return req.user;
  }
}