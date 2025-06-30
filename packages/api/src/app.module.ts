import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- CORE MODULES ---
import { PrismaModule } from './prisma/prisma.module'; // Provides global ManagementPrismaService
import { TenantMiddleware } from './tenant/middleware/tenant.middleware';

// --- FEATURE MODULES ---
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { ProductModule } from './dashboard/product/product.module';
import { CategoryModule } from './dashboard/category/category.module'; // <-- IMPORT
import { OrderModule } from './dashboard/order/order.module';

@Module({
  imports: [
    // --- CORE CONFIGURATION ---
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // Provides the global Management client

    // --- FEATURE MODULES ---
    AuthModule,
    TenantModule,
    ProductModule,
    CategoryModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // ** REMOVED **: TenantPrismaService is no longer provided here.
    // It's now neatly encapsulated within TenantPrismaModule, which
    // ProductModule imports directly.
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // The middleware setup remains the same, but you might need to ensure
    // TenantMiddleware is available. Since PrismaModule is global, it will be.
    consumer
      .apply(TenantMiddleware)
      // .forRoutes('v1/dashboard/*path')
      .forRoutes('*'); 

  }
}