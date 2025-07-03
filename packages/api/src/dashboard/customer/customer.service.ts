import { Injectable, NotFoundException, Scope, Inject, forwardRef } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ICustomerRepository } from './interfaces/customer-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class CustomerService {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.customerRepository.create(createCustomerDto);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    return this.customerRepository.findAll(paginationQuery);
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID '${id}' not found.`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id); // Ensure customer exists
    return this.customerRepository.update(id, updateCustomerDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure customer exists
    return this.customerRepository.remove(id);
  }
}
