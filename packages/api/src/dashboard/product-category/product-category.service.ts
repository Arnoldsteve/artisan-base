import { Injectable, Scope } from '@nestjs/common';
import { ProductCategoryRepository } from './product-category.repository';

@Injectable({ scope: Scope.REQUEST })
export class ProductCategoryService {
  constructor(private readonly repository: ProductCategoryRepository) {}

  assignProductToCategory(productId: string, categoryId: string) {
    return this.repository.assignProductToCategory(productId, categoryId);
  }

  unassignProductFromCategory(productId: string, categoryId: string) {
    return this.repository.unassignProductFromCategory(productId, categoryId);
  }

  getCategoriesForProduct(productId: string) {
    return this.repository.getCategoriesForProduct(productId);
  }

  getProductsForCategory(categoryId: string) {
    return this.repository.getProductsForCategory(categoryId);
  }
}
