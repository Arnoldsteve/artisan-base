import { Module, Scope } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    // SIMPLY LIST THE REPOSITORY CLASS.
    // NestJS will read its `@Injectable({ scope: Scope.REQUEST })` decorator
    // and handle the request-scoping automatically.
    CustomerRepository,
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class CustomerModule {}