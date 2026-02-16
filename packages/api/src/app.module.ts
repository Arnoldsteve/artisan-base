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

@Module({
  imports: [
    // 1. Global Configurations
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 2. Core Modules (Single instances shared across the app)
    PrismaModule, 
    TenantModule,     // Manages Organization & Membership logic
    UserModule,       // Manages Global Identity logic
    
    // 3. Orchestration Modules
    OnboardingModule, // Handles the Atomic registration flow
    AuthModule,
    ProductModule,
    
    // Note: Other modules (Dashboard, Billing, etc.) remain commented 
    // to keep the TypeScript compiler clean during the scale-up.
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