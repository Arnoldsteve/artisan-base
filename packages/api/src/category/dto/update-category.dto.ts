import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

/**
 * SOLID Principle: Open/Closed
 * By extending CreateCategoryDto with PartialType, we reuse all validation 
 * logic and documentation without duplicating code.
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}