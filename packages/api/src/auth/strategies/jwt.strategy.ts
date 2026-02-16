import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@/user/repositories/user.repository';

/**
 * SOLID Principle: Single Responsibility
 * This strategy is ONLY responsible for validating the JWT and 
 * reconstructing the user identity for the request lifecycle.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    super({
      // Extract token from 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'platform-secret-123',
    });
  }

  /**
   * This method is called automatically after the JWT is cryptographically verified.
   * The 'payload' contains the data we signed in AuthService.login.
   */
  async validate(payload: any) {
    // 1. Efficiency at Scale: We only need the ID and Global Role for most checks.
    // However, we verify the user still exists in the DB.
    const user = await this.userRepo.findById(payload.sub);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User no longer exists or has been deactivated');
    }

    // 2. Return the 'User' object which Passport attaches to 'request.user'
    return {
      id: user.id,
      email: user.email,
      globalRole: user.globalRole,
    };
  }
}