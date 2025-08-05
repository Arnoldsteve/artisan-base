import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { IStorefrontProductRepository } from './interfaces/storefront-product-repository.interface';
import { StorefrontProductRepository } from './storefront-product.repository'; // <-- IMPORT THE CLASS

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductService {
  constructor(
    // INJECT THE CLASS DIRECTLY. NestJS will use the class as the token.
    // The type can still be the interface for good practice.
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