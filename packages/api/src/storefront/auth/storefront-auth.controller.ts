import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { StorefrontAuthService } from './storefront-auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('storefront/auth')
export class StorefrontAuthController {
  constructor(private readonly authService: StorefrontAuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(dto);
    const { accessToken, ...rest } = result;
    res.cookie('storefront_jwt', accessToken, {
      httpOnly: true,
      secure: false, // for local dev
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      // domain: undefined, // do not set domain for localhost
    });
    return res.status(HttpStatus.CREATED).json(rest);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(dto);
    const { accessToken, ...rest } = result;
    res.cookie('storefront_jwt', accessToken, {
      httpOnly: true,
      secure: false, // for local dev
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      // domain: undefined, // do not set domain for localhost
    });
    return res.status(HttpStatus.OK).json(rest);
  }

  @Post('complete-registration')
  async completeRegistration(
    @Body() dto: CompleteRegistrationDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.completeRegistration(dto);
    const { accessToken, ...rest } = result;
    res.cookie('storefront_jwt', accessToken, {
      httpOnly: true,
      secure: false, // for local dev
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      // domain: undefined, // do not set domain for localhost
    });
    return res.status(HttpStatus.OK).json(rest);
  }

  @Get('profile')
  @UseGuards(AuthGuard('storefront-jwt'))
  async getProfile(@Req() req: Request, @Res() res: Response) {
    // req.user is set by the JwtStrategy
    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Not authenticated' });
    }
    // Optionally, you can fetch more customer info from DB if needed
    return res.status(HttpStatus.OK).json(req.user);
  }
}
