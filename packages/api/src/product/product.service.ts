import { Injectable } from '@nestjs/common';
import {  UpdateProductDto } from './dto/create-product.dto';
import { TenantPrismaService } from '../prisma/tenant-prisma.service'; // <-- Import this

@Injectable()
export class ProductService {
  // Inject our new service factory
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  // The method still accepts the tenantId
  async create(tenantId: string, createProductDto: UpdateProductDto) {
    // 1. Get the Prisma client specific to this tenant
    const prisma = this.tenantPrisma.getClient(tenantId);

    // 2. Use this client to perform the operation.
    //    It is now guaranteed to be operating on the correct schema.
    const product = await prisma.product.create({
      data: {
        name: createProductDto.name ?? '',
        description: createProductDto.description,
        price: createProductDto.price ?? 0,
        imageUrl: createProductDto.imageUrl,
      },
    });

    return product;
  }

  async findAllForTenant(tenantId: string) {
    // Get the client for the specific tenant
    const prisma = this.tenantPrisma.getClient(tenantId);

    // Fetch all products using that client
    return prisma.product.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest products first
      },
    });
  }

   async update(
    tenantId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const prisma = this.tenantPrisma.getClient(tenantId);

    // The 'update' operation is inherently safe because it's running
    // on a client that is already scoped to the correct tenant schema.
    return prisma.product.update({
      where: { id: productId },
      data: updateProductDto,
    });
  }

   async delete(tenantId: string, productId: string) {
    const prisma = this.tenantPrisma.getClient(tenantId);

    // Prisma's delete operation will automatically throw an error
    // if the product is not found, which is what we want.
    return prisma.product.delete({
      where: { id: productId },
    });
  }

}