import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PartialType takes all the validation rules from CreateProductDto
// and creates a new class where every property is also marked as optional.
export class UpdateProductDto extends PartialType(CreateProductDto) {}