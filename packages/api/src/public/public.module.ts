// In packages/api/src/public/public.module.ts
import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Import PrismaModule
import { TenantPrismaService } from '../prisma/tenant-prisma.service'; // <-- Import TenantPrismaService

@Module({
  imports: [PrismaModule], // <-- Make Prisma providers available
  controllers: [PublicController],
  providers: [TenantPrismaService], // <-- Provide TenantPrismaService
})
export class PublicModule {}