import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { IStorefrontProductRepository } from './interfaces/storefront-product-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontProductService {
  constructor(
    @Inject('StorefrontProductRepository')
    private readonly productRepository: IStorefrontProductRepository,
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
