import { Module, Scope } from '@nestjs/common';
import { StorefrontOrderService } from './storefront-order.service';
import { StorefrontOrderController } from './storefront-order.controller';
import { StorefrontOrderRepository } from './storefront-order.repository';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [TenantPrismaModule],
  controllers: [StorefrontOrderController],
  providers: [
    StorefrontOrderService,
    {
      provide: 'StorefrontOrderRepository',
      useClass: StorefrontOrderRepository,
    },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class StorefrontOrderModule {}
