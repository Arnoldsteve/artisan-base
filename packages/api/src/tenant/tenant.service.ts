// In packages/api/src/tenant/tenant.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async createTenant(tenantId: string): Promise<void> {
    try {
      // 1. Create the schema
      await this.prisma.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "tenant_${tenantId}";`,
      );

      // 2. Create the products table
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "tenant_${tenantId}"."products" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "price" DECIMAL(10,2) NOT NULL,
          "imageUrl" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          PRIMARY KEY ("id")
        );
      `);

      // 3. Create the orders table
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "tenant_${tenantId}"."orders" (
          "id" TEXT NOT NULL,
          "customerEmail" TEXT NOT NULL,
          "totalAmount" DECIMAL(10,2) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY ("id")
        );
      `);

      // You can add more table creation commands here as needed

    } catch (error) {
      console.error(`Failed to create tenant schema for ${tenantId}`, error);
      // Optional: Add cleanup logic here to drop the schema if table creation fails
      // await this.prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "tenant_${tenantId}";`);
      throw new InternalServerErrorException(
        'Could not initialize the store.',
      );
    }
  }
}