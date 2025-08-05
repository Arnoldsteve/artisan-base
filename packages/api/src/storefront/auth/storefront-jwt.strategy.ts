import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TenantClientFactory } from '../../prisma/tenant-client-factory.service';

@Injectable()
export class StorefrontJwtStrategy extends PassportStrategy(
  Strategy,
  'storefront-jwt',
) {
  constructor(private readonly tenantClientFactory: TenantClientFactory) {
    console.log('StorefrontJwtStrategy registered');
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables!');
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
    const tenant = req.tenant;
    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }

    // --- THIS IS THE KEY CHANGE ---
    // The factory method is now async, so we must `await` its result.
    const prisma = await this.tenantClientFactory.getClient(tenant.dbSchema);

    const customer = await prisma.customer.findUnique({
      where: { id: payload.sub },
    });

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      sub: customer.id,
      tenant: tenant,
    };
  }
}