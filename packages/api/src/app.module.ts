import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- CORE MODULES ---
import { PrismaModule } from './prisma/prisma.module'; 
import { TenantMiddleware } from './tenant/middleware/tenant.middleware';

// --- FEATURE MODULES ---
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { StorefrontModule } from './storefront/storefront.module';
import { TenantContextService } from './common/tenant-context.service';
import { TenantContextMiddleware } from './tenant/middleware/tenant-context.middleware';
import { SupabaseModule } from './supabase/supabase.module';
import { PlatformPlansModule } from './platform/plans/platform-plans.module'; 
import { DashboardModule } from './dashboard/dashboard.module';
import { BillingModule } from './billing/billing.module';
import { RedisModule } from './redis/redis.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 

    AuthModule,
    TenantModule,
    DashboardModule,
    StorefrontModule,
    SupabaseModule,
    PlatformPlansModule, 
    // Billing
    BillingModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TenantContextService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware, TenantContextMiddleware)
      .exclude(
        'dashboard/payments/webhook/mpesa',
        'dashboard/payments/webhook/stripe',
        'dashboard/payments/webhook/paypal',
      )
      .forRoutes('*');
  }
}
