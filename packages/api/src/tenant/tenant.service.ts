// In packages/api/src/tenant/tenant.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async createTenant(tenantId: string): Promise<void> {
    const schemaName = `tenant_${tenantId}`;
    try {
      // 1. Create the schema
      await this.prisma.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}";`,
      );

      // 2. Create the products table
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${schemaName}"."products" (
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
        CREATE TABLE IF NOT EXISTS "${schemaName}"."orders" (
          "id" TEXT NOT NULL,
          "customerEmail" TEXT NOT NULL,
          "totalAmount" DECIMAL(10,2) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          PRIMARY KEY ("id")
        );
      `);

      // 4. Create the order_items join table
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${schemaName}"."order_items" (
          "id" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL,
          "orderId" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          PRIMARY KEY ("id")
        );
      `);

      // 5. Add the foreign key constraints to the order_items table
      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE "${schemaName}"."order_items" 
        ADD CONSTRAINT "order_items_orderId_fkey" 
        FOREIGN KEY ("orderId") REFERENCES "${schemaName}"."orders"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
      `);
      
      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE "${schemaName}"."order_items"
        ADD CONSTRAINT "order_items_productId_fkey"
        FOREIGN KEY ("productId") REFERENCES "${schemaName}"."products"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
      `);

    } catch (error) {
      console.error(`Failed to create tenant schema for ${schemaName}`, error);
      throw new InternalServerErrorException(
        'Could not initialize the store.',
      );
    }
  }
}