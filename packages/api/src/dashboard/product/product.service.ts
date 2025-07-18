import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { IProductRepository } from './interfaces/product-repository.interface';
import { ProductCategoryService } from '../product-category/product-category.service';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: IProductRepository,
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

  // Assign a product to a category
  assignCategory(productId: string, categoryId: string) {
    return this.productCategoryService.assignProductToCategory(
      productId,
      categoryId,
    );
  }

  // Unassign a product from a category
  unassignCategory(productId: string, categoryId: string) {
    return this.productCategoryService.unassignProductFromCategory(
      productId,
      categoryId,
    );
  }
}
