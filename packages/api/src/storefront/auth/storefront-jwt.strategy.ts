import {
  Injectable,
  UnauthorizedException,
  Inject,
  Scope,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TenantPrismaService } from '../../prisma/tenant-prisma.service';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontJwtStrategy extends PassportStrategy(
  Strategy,
  'storefront-jwt',
) {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    private readonly prisma: TenantPrismaService,
  ) {
    console.log('StorefrontJwtStrategy registered');
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined in the environment variables!',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.storefront_jwt || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: { sub: string; email: string }) {
    // Use the tenant-aware Prisma service to look up the customer
    const customer = await this.prisma.customer.findUnique({
      where: { id: payload.sub },
    });
    if (!customer) {
      throw new UnauthorizedException();
    }
    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      sub: customer.id,
    };
  }
}
