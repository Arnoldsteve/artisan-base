import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Import
import { TenantModule } from '../tenant/tenant.module'; // <-- Import

@Module({
  imports: [PrismaModule, TenantModule], // <-- Add them here
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}
