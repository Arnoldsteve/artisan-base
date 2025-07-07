import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { IStorefrontCategoryRepository } from './interfaces/storefront-category-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontCategoryService {
  constructor(
    @Inject('StorefrontCategoryRepository')
    private readonly categoryRepository: IStorefrontCategoryRepository,
  ) {}

  async findAll(filters: GetCategoriesDto) {
    return this.categoryRepository.findAll(filters);
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }
}
