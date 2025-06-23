// In packages/api/src/order/dto/create-order.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsEmail()
  @IsNotEmpty()
  customerEmail!: string;

  @IsArray()
  @ValidateNested({ each: true }) // This validates each item in the array
  @Type(() => OrderItemDto) // This helps transform the plain object to our DTO class
  items!: OrderItemDto[];
}