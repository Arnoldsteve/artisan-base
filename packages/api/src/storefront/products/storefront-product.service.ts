import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { StorefrontProductRepository } from './storefront-product.repository';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductService {
  constructor(
    private readonly productRepository: StorefrontProductRepository, 
  ) {}

  async findAll(filters: GetProductsDto) {
    return this.productRepository.findAll(filters);
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return product;
  }

  async findFeatured() {
    return this.productRepository.findFeatured();
  }

  async findCategories() {
    return this.productRepository.findCategories();
  }
}