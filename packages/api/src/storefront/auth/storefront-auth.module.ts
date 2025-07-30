import { Global, Module } from '@nestjs/common';
import { StorefrontAuthController } from './storefront-auth.controller';
import { StorefrontAuthService } from './storefront-auth.service';
import { StorefrontAuthRepository } from './storefront-auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { StorefrontJwtStrategy } from './storefront-jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    PrismaModule, // This is sufficient as it's global
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
    // TenantClientFactory is no longer needed here as PrismaModule provides it globally.
  ],
  exports: [
    // We no longer need to export the factory.
    // We export the service if other modules need to use auth logic.
    StorefrontAuthService,
  ],
})
export class StorefrontAuthModule {}