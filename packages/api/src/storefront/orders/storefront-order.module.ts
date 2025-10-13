import { Module, Scope } from '@nestjs/common';
import { StorefrontOrderService } from './storefront-order.service';
import { StorefrontOrderController } from './storefront-order.controller';
import { StorefrontOrderRepository } from './storefront-order.repository';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [], // wa here TenantPrismaModule
  controllers: [StorefrontOrderController],
  providers: [
    StorefrontOrderService,
    StorefrontOrderRepository,
    // {
    //   provide: 'StorefrontOrderRepository',
    //   useClass: StorefrontOrderRepository,
    // },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ], 
  exports: [StorefrontOrderRepository], 
})
export class StorefrontOrderModule {}
