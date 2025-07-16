import { Test, TestingModule } from '@nestjs/testing';
import { StorefrontOrderController } from './storefront-order.controller';
import { StorefrontOrderService } from './storefront-order.service';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';

const mockOrderService = {
  create: jest.fn(),
};

describe('StorefrontOrderController', () => {
  let controller: StorefrontOrderController;
  let service: StorefrontOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorefrontOrderController],
      providers: [
        { provide: StorefrontOrderService, useValue: mockOrderService },
      ],
    }).compile();

    controller = module.get<StorefrontOrderController>(
      StorefrontOrderController,
    );
    service = module.get<StorefrontOrderService>(StorefrontOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order (success)', async () => {
    const dto: CreateStorefrontOrderDto = {
      shippingAddress: { address: '123 Main St' },
      billingAddress: { address: '123 Main St' },
      items: [{ productId: 'prod1', quantity: 1 }],
    };
    const mockResult = { success: true, order: { id: 'order1' } };
    mockOrderService.create.mockResolvedValueOnce(mockResult);
    const result = await controller.create(dto);
    expect(result).toEqual(mockResult);
    expect(mockOrderService.create).toHaveBeenCalledWith(dto);
  });

  it('should throw validation error for empty items', async () => {
    const dto: CreateStorefrontOrderDto = {
      shippingAddress: { address: '123 Main St' },
      billingAddress: { address: '123 Main St' },
      items: [],
    };
    mockOrderService.create.mockRejectedValueOnce(
      new Error('Order must have at least one item.'),
    );
    await expect(controller.create(dto)).rejects.toThrow(
      'Order must have at least one item.',
    );
  });
});
