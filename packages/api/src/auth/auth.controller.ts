import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // ------------------- SIGNUP -------------------
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    this.logger.log(`Signup attempt for email: ${signUpDto.email}`);
    return this.authService.signUp(signUpDto);
  }

  // ------------------- LOGIN -------------------
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  // ------------------- REFRESH TOKEN -------------------
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string, @Req() req) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshSession(refreshToken, ipAddress, userAgent);
  }

  // ------------------- LOGOUT -------------------
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  // ------------------- PROFILE -------------------
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req): Promise<UserProfileResponseDto> {
    this.logger.log(`Fetching profile for user ID: ${req.user.id}`);
    return this.authService.getProfile(req.user.id);
  }
}
