import { Module } from '@nestjs/common';
import { StorefrontAuthController } from './storefront-auth.controller';
import { StorefrontAuthService } from './storefront-auth.service';
import { StorefrontAuthRepository } from './storefront-auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { StorefrontJwtStrategy } from './storefront-jwt.strategy';

@Module({
  imports: [
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
  ],
})
export class AuthModule {}
