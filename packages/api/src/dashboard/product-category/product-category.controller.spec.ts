import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';

const mockService = {
  assignProductToCategory: jest.fn(),
  unassignProductFromCategory: jest.fn(),
  getCategoriesForProduct: jest.fn(),
  getProductsForCategory: jest.fn(),
};

describe('ProductCategoryController', () => {
  let controller: ProductCategoryController;
  let service: typeof mockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [{ provide: ProductCategoryService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductCategoryController>(
      ProductCategoryController,
    );
    service = module.get(ProductCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.assignProductToCategory on assign', () => {
    const body = { productId: 'p1', categoryId: 'c1' };
    controller.assign(body);
    expect(service.assignProductToCategory).toHaveBeenCalledWith('p1', 'c1');
  });

  it('should call service.unassignProductFromCategory on unassign', () => {
    const body = { productId: 'p1', categoryId: 'c1' };
    controller.unassign(body);
    expect(service.unassignProductFromCategory).toHaveBeenCalledWith(
      'p1',
      'c1',
    );
  });

  it('should call service.getCategoriesForProduct', () => {
    controller.getCategoriesForProduct('p1');
    expect(service.getCategoriesForProduct).toHaveBeenCalledWith('p1');
  });

  it('should call service.getProductsForCategory', () => {
    controller.getProductsForCategory('c1');
    expect(service.getProductsForCategory).toHaveBeenCalledWith('c1');
  });
});
