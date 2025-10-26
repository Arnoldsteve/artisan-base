import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- IMPORT THIS
import { JwtStrategy } from './jwt.strategy'; // <-- IMPORT THIS
import { ConfigModule } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { IAuthRepository } from './interfaces/auth-repository.interface';

@Module({
  imports: [
    ConfigModule, // <-- Add it here
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // You can even configure this part using the ConfigService for more power
      // but for now, this is fine.
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'AuthRepository', useClass: AuthRepository },
    JwtStrategy, 
  ],
  exports: [JwtStrategy, PassportModule],   
})
export class AuthModule {}