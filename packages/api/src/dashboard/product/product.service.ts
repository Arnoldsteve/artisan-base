import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable({ scope: Scope.REQUEST }) 
export class ProductService {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.tenantPrisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    return paginate(
      this.tenantPrisma.product,
      {
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      },
      {
        orderBy: {
          createdAt: 'desc',
        },
      },
    );
  }

  async findOne(id: string) {
    const product = await this.tenantPrisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const updatedProduct = await this.tenantPrisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.tenantPrisma.product.delete({
      where: { id: product.id }, 
    });
    
    return; 
  }
}