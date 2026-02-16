import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';

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

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    /**
     * FIX: Added both promises to the array so destructuring works.
     */
    const [items, total] = await Promise.all([
      this.productRepo.list({ skip, take: limit }),
      this.productRepo.count(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      }
    };
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