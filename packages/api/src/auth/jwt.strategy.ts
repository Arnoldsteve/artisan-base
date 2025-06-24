// In packages/api/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // We don't need to inject ConfigService for this fix.
  constructor(private prisma: PrismaService) {
    // --- THE DEFINITIVE FIX ---

    // 1. Get the secret directly from the environment.
    const secret = process.env.JWT_SECRET;

    // 2. Perform a runtime check. This also acts as a type guard for TypeScript.
    if (!secret) {
      // If the server starts without the secret, it will crash immediately.
      // This is GOOD. It prevents running in an insecure state.
      throw new Error('JWT_SECRET is not defined in the environment variables!');
    }

    // 3. Call super() only after the check.
    // TypeScript now knows that 'secret' is guaranteed to be a 'string', not 'undefined'.
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // Your validate method remains the same.
  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    
    return user;
  }
}