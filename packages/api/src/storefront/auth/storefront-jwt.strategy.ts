// src/storefront/auth/storefront-jwt.strategy.ts
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TenantClientFactory } from '../../prisma/tenant-client-factory.service';

@Injectable() // Remove request scope
export class StorefrontJwtStrategy extends PassportStrategy(
  Strategy,
  'storefront-jwt',
) {
  constructor(
    private readonly tenantClientFactory: TenantClientFactory,
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
      passReqToCallback: true, // This allows us to access the request
    });
  }

  async validate(req: any, payload: { sub: string; email: string }) {
    // Get tenant info from request (set by TenantMiddleware)
    const tenant = req.tenant;
    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }

    // Get tenant-specific Prisma client
    const prisma = this.tenantClientFactory.getTenantClient(tenant.dbSchema);
    
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
      tenant: tenant, // Include tenant info in user object
    };
  }
}