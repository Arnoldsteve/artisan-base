import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Import


@Module({
  imports: [PrismaModule], // <-- Add it here
  providers: [TenantService],
  exports: [TenantService], // <-- Export the service
})
export class TenantModule {}
