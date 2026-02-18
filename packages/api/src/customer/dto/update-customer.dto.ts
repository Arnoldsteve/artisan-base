import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

/**
 * SOLID Principle: Open/Closed
 * By extending CreateCustomerDto with PartialType, we reuse all validation 
 * logic and documentation without duplicating code.
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}