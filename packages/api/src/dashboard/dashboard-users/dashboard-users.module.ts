import { Module, Scope } from "@nestjs/common";
import { DashboardUsersController } from "./dashboard-users.controller";
import { DashboardUsersService } from "./dashboard-users.service";
import { DashboardUsersRepository } from "./dashboard-users.repository";
import { TenantContextService } from "@/common/tenant-context.service";


@Module({
    imports: [],
    controllers: [DashboardUsersController],
    providers: [
        DashboardUsersService, 
        DashboardUsersRepository,
         {
              provide: TenantContextService,
              useClass: TenantContextService,
              scope: Scope.REQUEST,
            },
    ],
})
export class DashboardUsersModule {}