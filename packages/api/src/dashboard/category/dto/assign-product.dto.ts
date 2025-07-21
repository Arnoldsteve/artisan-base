import { IsString, IsNotEmpty } from 'class-validator';

export class AssignProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
