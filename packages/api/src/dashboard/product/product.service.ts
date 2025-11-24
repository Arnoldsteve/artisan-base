import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductRepository } from './product.repository';
@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    return this.productRepository.findAll(paginationQuery);
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product.id);
    return;
  }

  assignCategory(productId: string, categoryId: string) {
    return this.productCategoryService.assignProductToCategory(
      productId,
      categoryId,
    );
  }

  unassignCategory(productId: string, categoryId: string) {
    return this.productCategoryService.unassignProductFromCategory(
      productId,
      categoryId,
    );
  }
}