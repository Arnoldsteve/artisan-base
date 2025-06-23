// In packages/api/src/public/public.controller.ts

import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Controller('public/stores') // Base path is /public/stores
export class PublicController {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  @Get(':storeId/products') // Handles GET /public/stores/malaikabeads/products
  async getPublicProducts(@Param('storeId') storeId: string) {
    // We use a try-catch block to handle cases where a store doesn't exist
    try {
      // Get the tenant-specific client
      const prisma = this.tenantPrisma.getClient(storeId);

      // Fetch the products
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return products;
    } catch (error) {
      // If getClient fails or findMany fails, it likely means the tenant doesn't exist.
      console.error(`Error fetching public products for store: ${storeId}`, error);
      throw new NotFoundException('Store not found.');
    }
  }
}