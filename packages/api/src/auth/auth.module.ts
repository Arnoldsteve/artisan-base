import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

// --- Internal Domain Modules ---
import { UserModule } from '@/user/user.module';
import { TenantModule } from '@/tenant/tenant.module';

/**
 * SOLID Principle: Dependency Injection / Modularization
 * This module configures the security infrastructure, including 
 * JWT settings and session management.
 */
@Module({
  imports: [
    UserModule,   // Needed to find users during login
    TenantModule, // Needed to discover tenants for the logged-in user
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Configure JWT dynamically using Environment Variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'platform-secret-123',
        signOptions: {
          expiresIn: '1h', // Access token expires in 1 hour
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenRepository,
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}