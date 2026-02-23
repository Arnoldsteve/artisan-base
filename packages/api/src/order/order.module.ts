import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';
import { ProductModule } from '@/product/product.module';
import { UserModule } from '@/user/user.module';

@Module({
   imports: [
    ProductModule, // Gives access to ProductRepository
    UserModule,    // Gives access to UserRepository
  ],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
