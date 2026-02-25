import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

/**
 * SOLID Principle: Open/Closed
 * By extending CreateOrderDto with PartialType, we reuse all validation 
 * logic and documentation without duplicating code.
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}