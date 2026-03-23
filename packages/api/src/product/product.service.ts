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
   * Logic: The Repository handles the 'Shape' and the Extension handles 'Isolation'.
   * Result: Works for both Global Marketplace and Isolated Storefronts.
   */
  async findAll(options: PageOptionsDto) {
    return this.productRepo.list(options);
  }

  /**
   * PUBLIC ACTION: Fetch Featured Products
   * millions of users: Used for landing pages and high-conversion areas.
   * Logic: Delegates to repo which filters by 'isFeatured: true' and 'isActive: true'.
   */
  async findFeatured(limit: number) {
    // this.logger.debug(`Fetching ${limit} featured products...`);
    
    // ⚡ Logic: The productRepo.findFeatured will automatically apply 
    // the 'tenantId' filter if the header was present in the request.
    const products = await this.productRepo.findFeatured(limit);
    
    return {
      success: true,
      data: products,
    };
  }

   /**
   * PUBLIC ACTION: Fetch product by URL Slug.
   * millions of users: Critical for SEO and social sharing.
   */
  async findBySlug(slug: string) {
    const product = await this.productRepo.findBySlug(slug);
    
    if (!product || !product.isActive) {
      throw new NotFoundException(`Product '${slug}' not found or is no longer available.`);
    }

    return product;
  }

  
  /**
   * PRIVATE ACTION: Fetch by ID (Internal/Dashboard use).
   */
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