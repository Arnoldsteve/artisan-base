import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaModule } from '../prisma/prisma.module'; 
import { TenantModule } from '../tenant/tenant.module'; 

@Module({
  imports: [PrismaModule, TenantModule], 
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}
