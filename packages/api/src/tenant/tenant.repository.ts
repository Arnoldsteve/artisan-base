import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITenantRepository } from './interfaces/tenant-repository.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TenantRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findTenantBySubdomain(subdomain: string) {
    return this.prisma.tenant.findUnique({ where: { subdomain } });
  }

  async createTenant(data: any) {
    return this.prisma.tenant.create({ data });
  }

  async deleteTenantById(id: string) {
    await this.prisma.tenant.delete({ where: { id } });
  }

  async executeRaw(sql: string) {
    return this.prisma.$executeRawUnsafe(sql);
  }

  async readTenantMigrationSql(): Promise<string> {
    const migrationsDir = path.join(
      __dirname,
      '..',
      '..',
      'prisma',
      'migrations',
    );
    const migrationFolder = (await fs.readdir(migrationsDir)).find((dir) =>
      dir.endsWith('_init_tenant_tables'),
    );
    if (!migrationFolder) {
      throw new InternalServerErrorException(
        'Tenant migration file not found.',
      );
    }
    const filePath = path.join(migrationsDir, migrationFolder, 'migration.sql');
    return fs.readFile(filePath, 'utf-8');
  }

  async getSettings(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    return tenant?.settings || {};
  }

  async updateSettings(tenantId: string, settings: any) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { settings },
      select: { settings: true },
    });
  }
}
