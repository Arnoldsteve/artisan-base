import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';

@Module({
  imports: [TenantPrismaModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}