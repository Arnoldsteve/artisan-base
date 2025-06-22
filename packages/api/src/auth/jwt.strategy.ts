import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// 1. Define a custom extractor function
const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
      return req.cookies['access_token'];

  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // This check satisfies TypeScript. If the secret is missing,
    // the app will crash on startup, which is what we want.
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set or is empty');
    }

    super({
      // Use fromExtractors to try multiple methods
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Try to get the token from the cookie
        cookieExtractor,
        // 2. If the cookie is not found, fall back to the Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        store: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { hashedPassword, ...result } = user;
    return result;
  }
}
