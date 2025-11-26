import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { StorefrontProductRepository } from './storefront-product.repository';
import { GetFeaturedProductsDto } from './dto/get-featured-products';
import { Cacheable } from '@/common/decorators/cacheable.decorator';
import { Redis } from '@upstash/redis';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductService {
  constructor(
    private readonly productRepository: StorefrontProductRepository,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  @Cacheable(
    6000,
    (filters: GetProductsDto, tenantId: string) =>
      `${tenantId}:products:${JSON.stringify(filters)}`,
  )
  async findAll(filters: GetProductsDto, tenantId: string) {
    return this.productRepository.findAll(filters);
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return product;
  }

  @Cacheable(
    6000,
    (filters: GetFeaturedProductsDto, tenantId: string) =>
      `featured:${tenantId}:limit:${filters.limit}:cursor:${filters.cursor || 'start'}`,
  )
  async findFeatured(filters: GetFeaturedProductsDto) {
    return this.productRepository.findFeatured(filters);
  }

  @Cacheable(6000, (tenantId: string) => `${tenantId}:categories`)
  async findCategories() {
    return this.productRepository.findCategories();
  }
}
