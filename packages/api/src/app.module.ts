// In packages/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core Modules for our new architecture
import { PrismaModule } from './prisma/prisma.module'; // Provides global ManagementPrismaService
import { AuthModule } from './auth/auth.module';       // Handles User signup/login
import { TenantModule } from './tenant/tenant.module';   // Handles Tenant creation

@Module({
  imports: [
    // --- CORE CONFIGURATION ---
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Provides ManagementPrismaService globally
    PrismaModule,

    // --- FEATURE MODULES ---
    // Handles user creation in the 'public' schema
    AuthModule,
    // Handles tenant creation and schema provisioning
    TenantModule,

    // We will re-introduce these modules later once they are refactored
    // to use the new tenant-specific database connection.
    // ProductModule,
    // OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}