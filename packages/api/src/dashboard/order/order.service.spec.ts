import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { NotFoundException } from '@nestjs/common';
import { IOrderRepository } from './interfaces/order-repository.interface';

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<IOrderRepository> = {
      createManualOrder: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
      updatePaymentStatus: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: 'OrderRepository', useValue: repoMock },
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
    repository = module.get('OrderRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a manual order', async () => {
    const dto = {
      items: [],
      customer: {},
      shippingAddress: {},
      billingAddress: {},
      notes: '',
      shippingAmount: 0,
    };
    const mockOrder = { id: '1', orderNumber: 'ORD-000001' };
    repository.createManualOrder.mockResolvedValue(mockOrder);
    const result = await service.createManualOrder(dto as any);
    expect(result).toEqual(mockOrder);
  });

  it('should find all orders', async () => {
    const mockOrders = [{ id: '1' }, { id: '2' }];
    repository.findAll.mockResolvedValue(mockOrders);
    const result = await service.findAll({ page: 1, limit: 10 } as any);
    expect(result).toEqual(mockOrders);
  });

  it('should find an order by id', async () => {
    const mockOrder = { id: '1', orderNumber: 'ORD-000001' };
    repository.findOne.mockResolvedValue(mockOrder);
    const result = await service.findOne('1');
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException if order not found', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
  });

  it('should update order status', async () => {
    const mockOrder = { id: '1', status: 'SHIPPED' };
    repository.findOne.mockResolvedValue(mockOrder);
    repository.updateStatus.mockResolvedValue({
      ...mockOrder,
      status: 'DELIVERED',
    });
    const result = await service.updateStatus('1', {
      status: 'DELIVERED',
    } as any);
    expect(result).toEqual({ ...mockOrder, status: 'DELIVERED' });
  });

  it('should update payment status', async () => {
    const mockOrder = { id: '1', paymentStatus: 'PAID' };
    repository.findOne.mockResolvedValue(mockOrder);
    repository.updatePaymentStatus.mockResolvedValue({
      ...mockOrder,
      paymentStatus: 'REFUNDED',
    });
    const result = await service.updatePaymentStatus('1', {
      paymentStatus: 'REFUNDED',
    } as any);
    expect(result).toEqual({ ...mockOrder, paymentStatus: 'REFUNDED' });
  });
});
