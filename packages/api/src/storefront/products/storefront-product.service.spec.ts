import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StorefrontProductService } from './storefront-product.service';

describe('StorefrontProductService', () => {
  let service: StorefrontProductService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findFeatured: jest.fn(),
      findCategories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorefrontProductService,
        {
          provide: 'StorefrontProductRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StorefrontProductService>(StorefrontProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return products from repository', async () => {
      const mockProducts = { data: [], meta: {} };
      const filters = { page: 1, limit: 20 };
      mockRepository.findAll.mockResolvedValue(mockProducts);

      const result = await service.findAll(filters);
      expect(result).toBe(mockProducts);
      expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      const mockProduct = { id: '1', name: 'Test Product' };
      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');
      expect(result).toBe(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findFeatured', () => {
    it('should return featured products from repository', async () => {
      const mockFeatured = [{ id: '1', name: 'Featured Product' }];
      mockRepository.findFeatured.mockResolvedValue(mockFeatured);

      const result = await service.findFeatured();
      expect(result).toBe(mockFeatured);
      expect(mockRepository.findFeatured).toHaveBeenCalled();
    });
  });

  describe('findCategories', () => {
    it('should return categories from repository', async () => {
      const mockCategories = ['Electronics', 'Clothing'];
      mockRepository.findCategories.mockResolvedValue(mockCategories);

      const result = await service.findCategories();
      expect(result).toBe(mockCategories);
      expect(mockRepository.findCategories).toHaveBeenCalled();
    });
  });
});
