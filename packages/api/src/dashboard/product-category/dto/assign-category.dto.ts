import { IsString, IsNotEmpty } from 'class-validator';

export class AssignCategoryDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
