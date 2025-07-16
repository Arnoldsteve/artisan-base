import { Test, TestingModule } from '@nestjs/testing';
import { StorefrontOrderService } from './storefront-order.service';
import { CreateStorefrontOrderDto } from './dto/create-storefront-order.dto';

const mockOrderRepository = {
  create: jest.fn(),
};

describe('StorefrontOrderService', () => {
  let service: StorefrontOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorefrontOrderService,
        { provide: 'StorefrontOrderRepository', useValue: mockOrderRepository },
      ],
    }).compile();

    service = module.get<StorefrontOrderService>(StorefrontOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.create with the DTO', async () => {
    const dto: CreateStorefrontOrderDto = {
      shippingAddress: { address: '123 Main St' },
      billingAddress: { address: '123 Main St' },
      items: [{ productId: 'prod1', quantity: 1 }],
    };
    const mockResult = { success: true, order: { id: 'order1' } };
    mockOrderRepository.create.mockResolvedValueOnce(mockResult);

    const result = await service.create(dto);
    expect(result).toEqual(mockResult);
    expect(mockOrderRepository.create).toHaveBeenCalledWith(dto);
  });

  it('should propagate errors from the repository', async () => {
    const dto: CreateStorefrontOrderDto = {
      shippingAddress: { address: '123 Main St' },
      billingAddress: { address: '123 Main St' },
      items: [],
    };
    mockOrderRepository.create.mockRejectedValueOnce(
      new Error('Order must have at least one item.'),
    );
    await expect(service.create(dto)).rejects.toThrow(
      'Order must have at least one item.',
    );
  });
});
