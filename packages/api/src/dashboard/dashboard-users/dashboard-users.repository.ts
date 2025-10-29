import { ConflictException, Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from '@/prisma/tenant-prisma.service';
import { CreateDashboardUserDto } from './dto/create-dashboard-user.dto';
import { UpdateDashboardUserDto } from './dto/update-dashboard-user.dto';
import { IDashboardUsersRepository } from './interfaces/dashboard-users-repository.interface';
import { PrismaClient } from 'generated/tenant';
import { paginate } from 'src/common/helpers/paginate.helper';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable({ scope: Scope.REQUEST })
export class DashboardUsersRepository implements IDashboardUsersRepository {
  private prismaClient: PrismaClient | null = null;

  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  private async getPrisma(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.tenantPrismaService.getClient();
    }
    return this.prismaClient;
  }

  async create( dto: CreateDashboardUserDto) {
    const prisma = await this.getPrisma();

    const existing = await prisma.dashboardUser.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists.');
    }

    return prisma.dashboardUser.create({
      data: { ...dto },
    });
  }

  async findAll( paginationQuery?: PaginationQueryDto) {
    const prisma = await this.getPrisma();

    return paginate(
      prisma.dashboardUser,
      {
        page: paginationQuery?.page,
        limit: paginationQuery?.limit,
      },
      {
        orderBy: { createdAt: 'desc' },
      },
    );
  }

  async findOne(id: string) {
    const prisma = await this.getPrisma();
    return prisma.dashboardUser.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateDashboardUserDto) {
    const prisma = await this.getPrisma();
    return prisma.dashboardUser.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const prisma = await this.getPrisma();
    return prisma.dashboardUser.delete({ where: { id } });
  }
}
