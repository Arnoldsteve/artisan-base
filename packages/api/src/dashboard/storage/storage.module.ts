import { Module, Scope } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { StorageRepository } from './storage.repository';
import { TenantContextService } from 'src/common/tenant-context.service'; 

@Module({
  imports: [],
  controllers: [StorageController],
  providers: [
    StorageService,
    // Just list the class, Nest handles it because it's decorated with @Injectable
    StorageRepository,
    // Provide the request-scoped TenantContextService, making it available for injection
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class StorageModule {}