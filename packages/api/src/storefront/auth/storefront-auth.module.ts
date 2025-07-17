// src/storefront/auth/storefront-auth.module.ts
import { Global, Module } from '@nestjs/common';
import { StorefrontAuthController } from './storefront-auth.controller';
import { StorefrontAuthService } from './storefront-auth.service';
import { StorefrontAuthRepository } from './storefront-auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { StorefrontJwtStrategy } from './storefront-jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { TenantClientFactory } from '../../prisma/tenant-client-factory.service';

@Global()
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [StorefrontAuthController],
  providers: [
    StorefrontAuthService,
    { provide: 'StorefrontAuthRepository', useClass: StorefrontAuthRepository },
    StorefrontJwtStrategy,
    TenantClientFactory, // Proper import, not require
  ],
  exports: [TenantClientFactory], // Export if needed elsewhere
})
export class StorefrontAuthModule {}