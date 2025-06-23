import { Controller, Get, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { OrderService } from 'src/order/order.service';

@Controller('public/stores')
export class PublicController {
  constructor(
    private readonly tenantPrisma: TenantPrismaService,
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  @Get(':storeId/products')
  async getPublicProducts(@Param('storeId') storeId: string) {
    try {
      const prisma = this.tenantPrisma.getClient(storeId);
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return products;
    } catch (error) {
      console.error(
        `Error fetching public products for store: ${storeId}`,
        error,
      );
      throw new NotFoundException('Store not found.');
    }
  }

  @Get(':storeId')
  async getPublicStore(@Param('storeId') storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found.');
    }
    return store;
  }

  @Get(':storeId/products/:productId')
  async getPublicProduct(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    try {
      const prisma = this.tenantPrisma.getClient(storeId);
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found.');
      }
      return product;
    } catch (error) {
      throw new NotFoundException('Store or product not found.');
    }
  }

  @Post(':storeId/orders')
  async createOrder(
    @Param('storeId') storeId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    // 2. We need to ensure the store actually exists first
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException('Store not found.');
    }

    return this.orderService.create(storeId, createOrderDto);
  }
}
