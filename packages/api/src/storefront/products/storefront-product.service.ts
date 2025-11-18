import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { StorefrontProductRepository } from './storefront-product.repository';
import { GetFeaturedProductsDto } from './dto/get-featured-products';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductService {
  constructor(
    private readonly productRepository: StorefrontProductRepository,
  ) {}

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

  async findFeatured(filters: GetFeaturedProductsDto, tenantId: string) {
    return this.productRepository.findFeatured(filters, tenantId);
  }

  async findCategories(tenantId: string) {
    return this.productRepository.findCategories(tenantId);
  }
}
