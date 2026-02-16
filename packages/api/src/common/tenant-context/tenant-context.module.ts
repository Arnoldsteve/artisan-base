import { Global, Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { TenantContextMiddleware } from './tenant-context.middleware';

@Global() // Makes the service available everywhere without re-importing
@Module({
  providers: [TenantContextService],
  exports: [TenantContextService],
})
export class TenantContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the middleware to every route
    // The middleware will internally decide which routes to skip
    consumer.apply(TenantContextMiddleware).forRoutes('*');
  }
}