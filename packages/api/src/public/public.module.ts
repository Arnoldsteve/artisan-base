import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { PrismaService } from '../prisma/prisma.service'; // Import it

@Module({
  imports: [PrismaModule],
  controllers: [PublicController],
  providers: [TenantPrismaService, PrismaService],
})
export class PublicModule {}