import { IsString, IsNotEmpty } from 'class-validator';

export class GetProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
