import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { OrderRepository } from './order.repository';

@Module({
  imports: [TenantPrismaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: 'OrderRepository', useClass: OrderRepository },
  ],
})
export class OrderModule {}
