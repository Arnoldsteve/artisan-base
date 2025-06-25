import { Injectable, Scope } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable({ scope: Scope.REQUEST }) // The service will be instantiated per request
export class ProductService {
  // NestJS can now inject the correctly configured TenantPrismaService
  // directly into our service for this request.
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // We are now guaranteed to be using the prisma client connected
    // to the correct tenant's schema!
    const product = await this.tenantPrisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  // You can add other methods like findAll, findOne, etc. here
  async findAll() {
    return this.tenantPrisma.product.findMany();
  }
}