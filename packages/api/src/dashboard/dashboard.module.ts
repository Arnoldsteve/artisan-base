import { Module } from '@nestjs/common';
import { BillingModule } from './billing/billing.module';
import { AdminHomeApiModule } from './admin-home-api/admin-home-api.module';
import { CategoryModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { SettingsModule } from './settings/settings.module';
import { StorageModule } from './storage/storage.module';
import { ProductCategoryModule } from './product-category/product-category.module';

@Module({
  imports: [
    AdminHomeApiModule,
    BillingModule, 
    CategoryModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
    ProductModule,
    ProductCategoryModule,
    SettingsModule,
    StorageModule,
  ],
})
export class DashboardModule {}