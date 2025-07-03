import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { NotFoundException } from '@nestjs/common';
import { ICustomerRepository } from './interfaces/customer-repository.interface';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: jest.Mocked<ICustomerRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<ICustomerRepository> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: 'CustomerRepository', useValue: repoMock },
      ],
    }).compile();
    service = module.get<CustomerService>(CustomerService);
    repository = module.get('CustomerRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a customer', async () => {
    const dto = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      hashedPassword: 'pw',
    };
    const mockCustomer = { id: '1', ...dto };
    repository.create.mockResolvedValue(mockCustomer);
    const result = await service.create(dto as any);
    expect(result).toEqual(mockCustomer);
  });

  it('should find a customer by id', async () => {
    const mockCustomer = {
      id: '1',
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      hashedPassword: 'pw',
    };
    repository.findOne.mockResolvedValue(mockCustomer);
    const result = await service.findOne('1');
    expect(result).toEqual(mockCustomer);
  });

  it('should throw NotFoundException if customer not found', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a customer', async () => {
    const mockCustomer = {
      id: '1',
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      hashedPassword: 'pw',
    };
    repository.findOne.mockResolvedValue(mockCustomer);
    repository.update.mockResolvedValue({ ...mockCustomer, firstName: 'C' });
    const result = await service.update('1', { firstName: 'C' } as any);
    expect(result).toEqual({ ...mockCustomer, firstName: 'C' });
  });

  it('should delete a customer', async () => {
    const mockCustomer = {
      id: '1',
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      hashedPassword: 'pw',
    };
    repository.findOne.mockResolvedValue(mockCustomer);
    repository.remove.mockResolvedValue(mockCustomer);
    const result = await service.remove('1');
    expect(result).toEqual(mockCustomer);
  });
});
