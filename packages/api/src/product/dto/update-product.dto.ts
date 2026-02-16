import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * SOLID Principle: Open/Closed
 * By extending CreateProductDto with PartialType, we reuse all validation 
 * logic and documentation without duplicating code.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}