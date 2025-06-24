import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [JwtModule.register({})], 
  controllers: [TenantController],
  providers: [TenantService, PrismaService],
})
export class TenantModule {}
