import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { TenantPrismaService } from '../prisma/tenant-prisma.service'; // <-- Import this

@Injectable()
export class ProductService {
  // Inject our new service factory
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  // The method still accepts the tenantId
  async create(tenantId: string, createProductDto: CreateProductDto) {
    // 1. Get the Prisma client specific to this tenant
    const prisma = this.tenantPrisma.getClient(tenantId);

    // 2. Use this client to perform the operation.
    //    It is now guaranteed to be operating on the correct schema.
    const product = await prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        imageUrl: createProductDto.imageUrl,
      },
    });

    return product;
  }
}