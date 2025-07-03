import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NotFoundException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<OrderService> = {
      createManualOrder: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
      updatePaymentStatus: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: serviceMock }],
    }).compile();
    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    service.createManualOrder.mockResolvedValue(mockOrder);
    const result = await controller.createManualOrder(dto as any);
    expect(result).toEqual(mockOrder);
    expect(service.createManualOrder).toHaveBeenCalledWith(dto);
  });

  it('should return all orders', async () => {
    const mockOrders = [{ id: '1' }, { id: '2' }];
    service.findAll.mockResolvedValue(mockOrders);
    const result = await controller.findAll({ page: 1, limit: 10 } as any);
    expect(result).toEqual(mockOrders);
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should return an order by id', async () => {
    const mockOrder = { id: '1', orderNumber: 'ORD-000001' };
    service.findOne.mockResolvedValue(mockOrder);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockOrder);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if order not found', async () => {
    service.findOne.mockRejectedValue(new NotFoundException('Order not found'));
    await expect(controller.findOne('bad-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update order status', async () => {
    const mockOrder = { id: '1', status: 'DELIVERED' };
    service.updateStatus.mockResolvedValue(mockOrder);
    const result = await controller.updateStatus('1', {
      status: 'DELIVERED',
    } as any);
    expect(result).toEqual(mockOrder);
    expect(service.updateStatus).toHaveBeenCalledWith('1', {
      status: 'DELIVERED',
    });
  });

  it('should update payment status', async () => {
    const mockOrder = { id: '1', paymentStatus: 'PAID' };
    service.updatePaymentStatus.mockResolvedValue(mockOrder);
    const result = await controller.updatePaymentStatus('1', {
      paymentStatus: 'PAID',
    } as any);
    expect(result).toEqual(mockOrder);
    expect(service.updatePaymentStatus).toHaveBeenCalledWith('1', {
      paymentStatus: 'PAID',
    });
  });
});
