import { Module, Scope } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class OrderModule {}