import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from './repositories/customer.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepo: CustomerRepository) {}

  async create(dto: CreateCustomerDto) {
    const existing = await this.customerRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Customer with this email already exists in your store');
    }
    return this.customerRepo.create(dto as any);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const[data, total]= await Promise.all([
       this.customerRepo.list({ skip, take:limit }),
       this.customerRepo.count(),
    ]);

    return{
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total /limit),
      }
    }
  }

  async findOne(id: string) {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  /**
   * Updates a customer.
   * Includes a check to ensure email remains unique within the tenant.
   */
  async update(id: string, dto: UpdateCustomerDto) {
    // 1. Ensure the customer exists
    await this.findOne(id);

    // 2. If email is being changed, check for conflicts
    if (dto.email) {
      const existing = await this.customerRepo.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Another customer already uses this email');
      }
    }

    return this.customerRepo.update(id, dto);
  }

  /**
   * Deletes a customer.
   * Row-level isolation ensures you only delete from your own tenant.
   */
  async remove(id: string) {
    // Ensure the customer exists before trying to delete
    await this.findOne(id);
    
    return this.customerRepo.remove(id);
  }
}