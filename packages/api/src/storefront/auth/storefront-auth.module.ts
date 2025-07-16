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
    { provide: 'STORE_FRONT_JWT_STRATEGY', useClass: StorefrontJwtStrategy },
  ],
})
export class StorefrontAuthModule {}
