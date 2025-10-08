import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { TenantRepository } from './tenant.repository';
import { ITenantRepository } from './interfaces/tenant-repository.interface';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TenantController],
  providers: [
    TenantService,
    // PrismaService,
    { provide: 'TenantRepository', useClass: TenantRepository },
  ],
})
export class TenantModule {}
