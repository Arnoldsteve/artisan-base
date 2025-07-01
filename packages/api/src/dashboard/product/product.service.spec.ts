import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: TenantPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: TenantPrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
    prisma = module.get<TenantPrismaService>(TenantPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Example: create product happy path
  it('should create a product', async () => {
    const dto = { name: 'Test', price: 100, inventoryQuantity: 10 };
    const mockProduct = { id: 'prod1', ...dto };
    prisma.product.create.mockResolvedValue(mockProduct);
    const result = await service.create(dto as any);
    expect(result).toEqual(mockProduct);
  });

  // Add more tests: update, delete, findOne (not found), findAll (pagination), validation
});
