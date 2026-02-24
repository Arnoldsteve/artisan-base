import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';
import { OrderListener } from './listeners/order.listener'; 
import { ProductModule } from '@/product/product.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    ProductModule, 
    UserModule,
    BullModule.registerQueue(
      { name: 'order-queue' },
      { name: 'notification-queue' },
      { name: 'payment-queue' },
    ),
  ],
  controllers: [OrderController],
  providers: [
    OrderService, 
    OrderRepository, 
    OrderListener
  ],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}