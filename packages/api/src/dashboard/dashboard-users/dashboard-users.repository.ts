import { ConflictException, Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from '@/prisma/tenant-prisma.service';
import { CreateDashboardUserDto } from './dto/create-dashboard-user.dto';
import { UpdateDashboardUserDto } from './dto/update-dashboard-user.dto';
import { IDashboardUsersRepository } from './interfaces/dashboard-users-repository.interface';
import { PrismaClient } from 'generated/tenant';
import * as bcrypt from 'bcrypt';
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

  // --- Helper to exclude sensitive fields ---
  private exclude<T, Key extends keyof T>(obj: T, keys: Key[]): Omit<T, Key> {
    const copy = { ...obj };
    keys.forEach((key) => delete copy[key]);
    return copy;
  }

  // --- Create ---
  async create(createDashboardUserDto: CreateDashboardUserDto) {
    const prisma = await this.getPrisma();
    const { email, password, firstName, lastName, role } =
      createDashboardUserDto;

    const existing = await prisma.dashboardUser.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.dashboardUser.create({
      data: { email, hashedPassword, firstName, lastName, role },
    });

    const safeUser = this.exclude(user, ['hashedPassword']);
    return { data: safeUser, message: 'User created successfully' };
  }

  // --- Find All ---
  async findAll(paginationQuery?: PaginationQueryDto) {
    const prisma = await this.getPrisma();

    return paginate(
      prisma.dashboardUser,
      {
        page: paginationQuery?.page,
        limit: paginationQuery?.limit,
      },
      {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    );
  }

  // --- Find One ---
  async findOne(id: string) {
    const prisma = await this.getPrisma();

    const user = await prisma.dashboardUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return { data: null, message: 'User not found' };
    return { data: user, message: 'User fetched successfully' };
  }

  // --- Update ---
  async update(id: string, dto: UpdateDashboardUserDto) {
    const prisma = await this.getPrisma();
    const updatedUser = await prisma.dashboardUser.update({
      where: { id },
      data: dto,
    });

    const safeUser = this.exclude(updatedUser, ['hashedPassword']);
    return { data: safeUser, message: 'User updated successfully' };
  }

  async remove(id: string) {
    const prisma = await this.getPrisma();
    await prisma.dashboardUser.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
