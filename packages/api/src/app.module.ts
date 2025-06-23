import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenant/tenant.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { PublicModule } from './public/public.module';
import { StorageService } from './storage/storage.service';
import { StorageController } from './storage/storage.controller';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      ignoreEnvFile: false,
    }),
    PrismaModule,
    AuthModule,
    TenantModule,
    StoreModule,
    ProductModule,
    PublicModule,
    StorageModule,
  ],
  controllers: [AppController, StorageController],
  providers: [AppService, StorageService],
})
export class AppModule {}