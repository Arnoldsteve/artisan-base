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
    // SIMPLY LIST THE REPOSITORY CLASS HERE.
    // NestJS will read its `@Injectable({ scope: Scope.REQUEST })` decorator
    // and handle the request-scoping automatically.
    OrderRepository,
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class OrderModule {}