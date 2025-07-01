import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from 'decimal.js';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: TenantPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: TenantPrismaService,
          useValue: {
            $transaction: jest.fn(),
            order: {
              findUnique: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            product: { findMany: jest.fn(), update: jest.fn() },
            productVariant: { findMany: jest.fn(), update: jest.fn() },
            customer: { upsert: jest.fn() },
          },
        },
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
    prisma = module.get<TenantPrismaService>(TenantPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Example: createManualOrder happy path
  it('should create an order (happy path)', async () => {
    // Mock all necessary Prisma calls for a successful order
    const mockCustomer = {
      id: 'cust1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };
    const mockProduct = {
      id: 'prod1',
      name: 'Product',
      inventoryQuantity: 10,
      price: 100,
      sku: 'SKU',
      images: [{ url: 'img.png' }],
    };
    const mockOrder = {
      id: 'order1',
      orderNumber: 'ORD-000001',
      items: [],
      customer: mockCustomer,
    };
    prisma.$transaction.mockImplementation(async (cb) => cb(prisma));
    prisma.customer.upsert.mockResolvedValue(mockCustomer);
    prisma.product.findMany.mockResolvedValue([mockProduct]);
    prisma.productVariant.findMany.mockResolvedValue([]);
    prisma.order.findFirst.mockResolvedValue(null);
    prisma.order.create.mockResolvedValue(mockOrder);
    prisma.product.update.mockResolvedValue({});

    const dto = {
      items: [{ productId: 'prod1', quantity: 2 }],
      customer: mockCustomer,
      shippingAddress: {},
      billingAddress: {},
      notes: '',
      shippingAmount: 10,
    };
    const result = await service.createManualOrder(dto as any);
    expect(result).toEqual(mockOrder);
  });

  it('should throw if product not found', async () => {
    prisma.$transaction.mockImplementation(async (cb) => cb(prisma));
    prisma.customer.upsert.mockResolvedValue({});
    prisma.product.findMany.mockResolvedValue([]); // No products found
    prisma.productVariant.findMany.mockResolvedValue([]);
    const dto = {
      items: [{ productId: 'prodX', quantity: 1 }],
      customer: {},
      shippingAddress: {},
      billingAddress: {},
      notes: '',
      shippingAmount: 0,
    };
    await expect(service.createManualOrder(dto as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if insufficient stock', async () => {
    prisma.$transaction.mockImplementation(async (cb) => cb(prisma));
    prisma.customer.upsert.mockResolvedValue({});
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'prod1',
        name: 'Product',
        inventoryQuantity: 1,
        price: 100,
        sku: 'SKU',
        images: [],
      },
    ]);
    prisma.productVariant.findMany.mockResolvedValue([]);
    const dto = {
      items: [{ productId: 'prod1', quantity: 2 }],
      customer: {},
      shippingAddress: {},
      billingAddress: {},
      notes: '',
      shippingAmount: 0,
    };
    await expect(service.createManualOrder(dto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if variant not found', async () => {
    prisma.$transaction.mockImplementation(async (cb) => cb(prisma));
    prisma.customer.upsert.mockResolvedValue({});
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'prod1',
        name: 'Product',
        inventoryQuantity: 10,
        price: 100,
        sku: 'SKU',
        images: [],
      },
    ]);
    prisma.productVariant.findMany.mockResolvedValue([]); // No variants found
    const dto = {
      items: [{ productId: 'prod1', variantId: 'varX', quantity: 1 }],
      customer: {},
      shippingAddress: {},
      billingAddress: {},
      notes: '',
      shippingAmount: 0,
    };
    await expect(service.createManualOrder(dto as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if variant does not belong to product', async () => {
    prisma.$transaction.mockImplementation(async (cb) => cb(prisma));
    prisma.customer.upsert.mockResolvedValue({});
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'prod1',
        name: 'Product',
        inventoryQuantity: 10,
        price: 100,
        sku: 'SKU',
        images: [],
      },
    ]);
    prisma.productVariant.findMany.mockResolvedValue([
      {
        id: 'var1',
        productId: 'otherProd',
        inventoryQuantity: 10,
        price: 100,
        name: 'Var',
        sku: 'VSKU',
      },
    ]);
    const dto = {
      items: [{ productId: 'prod1', variantId: 'var1', quantity: 1 }],
      customer: {},
      shippingAddress: {},
      billingAddress: {},
      notes: '',
      shippingAmount: 0,
    };
    await expect(service.createManualOrder(dto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException if order not found', async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
  });

  it('should update status', async () => {
    prisma.order.findUnique.mockResolvedValue({ id: 'order1' });
    prisma.order.update.mockResolvedValue({ id: 'order1', status: 'SHIPPED' });
    const result = await service.updateStatus('order1', { status: 'SHIPPED' });
    expect(result).toEqual({ id: 'order1', status: 'SHIPPED' });
  });

  it('should update payment status', async () => {
    prisma.order.findUnique.mockResolvedValue({ id: 'order1' });
    prisma.order.update.mockResolvedValue({
      id: 'order1',
      paymentStatus: 'PAID',
    });
    const result = await service.updatePaymentStatus('order1', {
      paymentStatus: 'PAID',
    });
    expect(result).toEqual({ id: 'order1', paymentStatus: 'PAID' });
  });

  // Add more as needed for full coverage
});
