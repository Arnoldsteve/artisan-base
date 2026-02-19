import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly tenantContext: TenantContextService, 
  ) {}

  async create(dto: CreateProductDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    if (dto.sku) {
      const skuExists = await this.productRepo.existsBySku(dto.sku);
      if (skuExists) throw new ConflictException('SKU already exists');
    }

    const slugExists = await this.productRepo.findBySlug(dto.slug);
    if (slugExists) throw new ConflictException('Slug already taken');

    return this.productRepo.create({
      tenantId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      sku: dto.sku,
      inventoryQuantity: dto.inventoryQuantity,
      images: dto.images as any,
      isActive: dto.isActive,
      /**
       * FIX: Nested creates for join tables also need the tenantId
       * because ProductCategory is an isolated model.
       */
      categories: dto.categoryIds ? {
        create: dto.categoryIds.map(id => ({ 
          categoryId: id,
          tenantId: tenantId 
        }))
      } : undefined
    });
  }

  /**
   * Enterprise Standard: Clean "One-Liner" Service.
   * Business logic only orchestrates; pagination and data shape are delegated to the Repository.
   */
  async findAll(options: PageOptionsDto) {
    return this.productRepo.list(options);
  }

  async findOne(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.productRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.productRepo.delete(id);
  }
}