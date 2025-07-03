import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [TenantPrismaModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    { provide: 'CustomerRepository', useClass: CustomerRepository },
  ],
})
export class CustomerModule {}
