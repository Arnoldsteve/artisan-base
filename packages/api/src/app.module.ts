import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// --- CORE & INFRASTRUCTURE ---
import { PrismaModule } from '@/prisma/prisma.module';
import { TenantContextMiddleware } from '@/common/tenant-context/tenant-context.middleware';

// --- FEATURE MODULES ---
import { OnboardingModule } from '@/onboarding/onboarding.module';
import { TenantModule } from '@/tenant/tenant.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomerModule } from './customer/customer.module';
import { CommonCacheModule } from './common/cache/common-cache.module';

@Module({
  imports: [
    // 1. Global Configurations
    ConfigModule.forRoot({ isGlobal: true }),
     EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    
    // 2. Core Modules (Single instances shared across the app)
    CommonCacheModule, // 1. This must be here to enable the @Global() providers
    PrismaModule, 
    TenantModule,     // Manages Organization & Membership logic
    UserModule,       // Manages Global Identity logic
    
    // 3. Orchestration Modules
    OnboardingModule, // Handles the Atomic registration flow
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    PaymentModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  /**
   * SOLID Principle: Open/Closed
   * We apply the TenantContextMiddleware globally to all routes.
   * The middleware itself handles the logic of which routes require 
   * a Tenant ID and which are public. This follows the DRY principle.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantContextMiddleware)
      .forRoutes('(.*)') 
  }
}