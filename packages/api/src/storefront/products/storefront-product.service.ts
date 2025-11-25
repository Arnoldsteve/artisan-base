import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { StorefrontProductRepository } from './storefront-product.repository';
import { GetFeaturedProductsDto } from './dto/get-featured-products';
import { Redis } from '@upstash/redis';
import { Cacheable } from '@/common/decorators/cacheable.decorator';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductService {
  constructor(
    private readonly productRepository: StorefrontProductRepository,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}


  @Cacheable(
    300,
    (filters: GetProductsDto, tenantId: string) =>
      `${tenantId}:products:${JSON.stringify(filters)}`,
  )
  async findAll(filters: GetProductsDto, tenantId: string) {
    return this.productRepository.findAll(filters, tenantId);
  }


  async findOne(id: string) {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return product;
  }


   @Cacheable(300, (filters: GetFeaturedProductsDto, tenantId: string) => 
    `featured:${tenantId}:limit:${filters.limit}:cursor:${filters.cursor || 'start'}`
  )
  async findFeatured(filters: GetFeaturedProductsDto, tenantId: string) {
    return this.productRepository.findFeatured(filters, tenantId);
  }

  @Cacheable(30, (tenantId: string) => `${tenantId}:categories`)
  async findCategories(tenantId: string) {
    return this.productRepository.findCategories(tenantId);
  }
}
