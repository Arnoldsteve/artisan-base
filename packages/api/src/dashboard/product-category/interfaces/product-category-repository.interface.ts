export interface IProductCategoryRepository {
  assignProductToCategory(productId: string, categoryId: string): Promise<any>;
  unassignProductFromCategory(
    productId: string,
    categoryId: string,
  ): Promise<any>;
  getCategoriesForProduct(productId: string): Promise<any>;
  getProductsForCategory(categoryId: string): Promise<any>;
}
