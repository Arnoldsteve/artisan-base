import { Module, Scope } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
// import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { CustomerRepository } from './customer.repository';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    { provide: 'CustomerRepository', useClass: CustomerRepository },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class CustomerModule {}
