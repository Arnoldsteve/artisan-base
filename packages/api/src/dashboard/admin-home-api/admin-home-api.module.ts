// File: packages/api/src/dashboard/admin-home-api/admin-home-api.module.ts

import { Module, Scope } from '@nestjs/common';
import { AdminHomeApiController } from './admin-home-api.controller';
import { AdminHomeApiService } from './admin-home-api.service';
import { AdminHomeApiRepository } from './admin-home-api.repository';
import { IAdminHomeApiRepository } from './interfaces/admin-home-api-repository.interface';

@Module({
  controllers: [AdminHomeApiController],
  providers: [
    AdminHomeApiService,
    {
      // This tells NestJS: "When a service asks for the token 'IAdminHomeApiRepository',
      // provide it with an instance of the AdminHomeApiRepository class."
      provide: IAdminHomeApiRepository,
      useClass: AdminHomeApiRepository,
      scope: Scope.REQUEST,
    },
  ],
})
export class AdminHomeApiModule {}