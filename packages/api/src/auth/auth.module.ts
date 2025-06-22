// In packages/api/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'; // <-- Still need this
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})], // <-- Simplified registration
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}