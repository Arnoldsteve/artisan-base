import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { StorefrontCategoryRepository } from './storefront-category.repository';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontCategoryService {
  constructor(
    private readonly categoryRepository: StorefrontCategoryRepository,
  ) {}

  async findAll(filters: GetCategoriesDto, tenantId: string) {
    return this.categoryRepository.findAll(filters, tenantId);
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }
}
