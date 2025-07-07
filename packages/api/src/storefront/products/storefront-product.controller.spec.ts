import { Test, TestingModule } from '@nestjs/testing';
import { StorefrontProductController } from './storefront-product.controller';
import { StorefrontProductService } from './storefront-product.service';

describe('StorefrontProductController', () => {
  let controller: StorefrontProductController;
  let service: StorefrontProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorefrontProductController],
      providers: [
        {
          provide: StorefrontProductService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findFeatured: jest.fn(),
            findCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StorefrontProductController>(
      StorefrontProductController,
    );
    service = module.get<StorefrontProductService>(StorefrontProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return products', async () => {
      const mockProducts = { data: [], meta: {} };
      jest.spyOn(service, 'findAll').mockResolvedValue(mockProducts);

      const result = await controller.findAll({});
      expect(result).toBe(mockProducts);
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const mockProduct = { id: '1', name: 'Test Product' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');
      expect(result).toBe(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findFeatured', () => {
    it('should return featured products', async () => {
      const mockFeatured = [{ id: '1', name: 'Featured Product' }];
      jest.spyOn(service, 'findFeatured').mockResolvedValue(mockFeatured);

      const result = await controller.findFeatured();
      expect(result).toBe(mockFeatured);
      expect(service.findFeatured).toHaveBeenCalled();
    });
  });

  describe('findCategories', () => {
    it('should return categories', async () => {
      const mockCategories = ['Electronics', 'Clothing'];
      jest.spyOn(service, 'findCategories').mockResolvedValue(mockCategories);

      const result = await controller.findCategories();
      expect(result).toBe(mockCategories);
      expect(service.findCategories).toHaveBeenCalled();
    });
  });
});
